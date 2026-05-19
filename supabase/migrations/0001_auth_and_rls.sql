-- =============================================================================
-- ANOTA-AI · Migration 0001 — Auth + RLS + vínculo de WhatsApp
-- =============================================================================
-- O QUE ESTA MIGRATION FAZ:
--   1. Cria a tabela `profiles` espelhando auth.users, com `whatsapp_phone`
--      para o agente conseguir descobrir o user_id a partir do número de
--      WhatsApp que recebeu a mensagem.
--   2. Adiciona `user_id` na tabela `expenses` (FK -> auth.users).
--   3. Habilita Row Level Security em ambas as tabelas e cria políticas
--      garantindo que cada usuário só enxergue/edite os próprios dados.
--   4. Cria um trigger que, ao registrar um novo usuário, insere a linha
--      correspondente em `profiles` automaticamente.
--   5. Habilita Realtime na tabela `expenses`.
--
-- COMO RODAR:
--   - Painel Supabase → SQL Editor → cole tudo e execute.
--   - Ou via CLI: `supabase db push` se estiver usando supabase/migrations.
--
-- DEPOIS DE RODAR:
--   - Em Authentication → Providers → Email: garantir que está habilitado
--     (vem habilitado por padrão).
--   - Em Authentication → URL Configuration: ajustar o "Site URL" e
--     "Redirect URLs" pro endereço onde a app roda (ex: http://localhost:5173).
--   - Caso já existam linhas em `expenses` sem user_id, elas ficam invisíveis
--     pra todos os usuários até serem manualmente associadas (UPDATE expenses
--     SET user_id = '<uuid>' WHERE ...).
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Tabela profiles
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  display_name    text,
  whatsapp_phone  text unique,                  -- E.164 sem espaços: +5511987654321
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table  public.profiles is
  'Dados públicos do usuário. 1:1 com auth.users.';
comment on column public.profiles.whatsapp_phone is
  'Telefone vinculado ao WhatsApp do agente, formato E.164. UNIQUE pra permitir lookup reverso.';

-- índice extra explícito (UNIQUE já cria um, mas deixo nomeado por clareza).
create index if not exists profiles_whatsapp_phone_idx
  on public.profiles (whatsapp_phone);


-- -----------------------------------------------------------------------------
-- 2. Coluna user_id em expenses
-- -----------------------------------------------------------------------------
-- Adicionada como nullable pra não quebrar caso a tabela já tenha linhas.
-- Em produção, depois de associar tudo, dá pra rodar:
--   alter table public.expenses alter column user_id set not null;
alter table public.expenses
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

create index if not exists expenses_user_id_occurred_at_idx
  on public.expenses (user_id, occurred_at desc);


-- -----------------------------------------------------------------------------
-- 3. Trigger: ao criar usuário em auth.users, criar profile correspondente
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer            -- precisa rodar com privilégio elevado
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();


-- -----------------------------------------------------------------------------
-- 4. Trigger: manter updated_at em profiles
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();


-- -----------------------------------------------------------------------------
-- 5. Row Level Security
-- -----------------------------------------------------------------------------

-- ---- profiles --------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "profiles: select own"  on public.profiles;
drop policy if exists "profiles: update own"  on public.profiles;

create policy "profiles: select own"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- INSERT é feito pelo trigger handle_new_user (security definer), então não
-- precisamos de policy de insert pro client. DELETE é cascateado por auth.users.


-- ---- expenses --------------------------------------------------------------
alter table public.expenses enable row level security;

drop policy if exists "expenses: select own"  on public.expenses;
drop policy if exists "expenses: insert own"  on public.expenses;
drop policy if exists "expenses: update own"  on public.expenses;
drop policy if exists "expenses: delete own"  on public.expenses;

create policy "expenses: select own"
  on public.expenses
  for select
  using (auth.uid() = user_id);

-- O agente de WhatsApp roda com service_role (bypassa RLS), então o INSERT
-- de produção vem dele com user_id preenchido. Mas se algum dia houver UI
-- pra criar despesa manualmente, esta policy permite — desde que user_id
-- bata com o auth.uid().
create policy "expenses: insert own"
  on public.expenses
  for insert
  with check (auth.uid() = user_id);

create policy "expenses: update own"
  on public.expenses
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "expenses: delete own"
  on public.expenses
  for delete
  using (auth.uid() = user_id);


-- -----------------------------------------------------------------------------
-- 6. Realtime — habilitar expenses na publicação supabase_realtime
-- -----------------------------------------------------------------------------
-- Idempotente: ignora se já estiver lá.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'expenses'
  ) then
    alter publication supabase_realtime add table public.expenses;
  end if;
end $$;


-- =============================================================================
-- FIM
-- =============================================================================
-- INSTRUÇÕES PRO AGENTE DE WHATSAPP (lado servidor):
--   Quando chegar mensagem do número +5511987654321, o agente faz:
--     select id from public.profiles where whatsapp_phone = '+5511987654321';
--   E usa esse id como user_id no insert da despesa.
--   O agente DEVE usar a service_role key (não a anon) pra fazer esses
--   inserts, pois ele atua em nome do usuário, não autenticado.
-- =============================================================================
