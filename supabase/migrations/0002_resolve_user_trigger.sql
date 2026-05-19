-- =============================================================================
-- ANOTA-AI · Migration 0002 — Resolução automática de user_id
-- =============================================================================
-- CONTEXTO:
--   O agente WhatsApp insere despesas preenchendo a coluna `whatsapp_number`
--   no formato JID do WhatsApp: `5519982796873@s.whatsapp.net`.
--   Já em `profiles.whatsapp_phone` o número está em E.164: `+5519982796873`.
--
--   Esta migration:
--     1. Cria função `normalize_whatsapp_jid()` que converte JID → E.164.
--     2. Cria trigger BEFORE INSERT que, se `user_id` veio null, busca
--        o id correspondente em profiles a partir do whatsapp_number.
--     3. Faz backfill das despesas existentes que ainda estão sem user_id.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Função de normalização
--    Aceita os formatos vindos do agente e devolve E.164 (+55...).
--    Exemplos:
--      "5519982796873@s.whatsapp.net" -> "+5519982796873"
--      "+5519982796873"               -> "+5519982796873"
--      "5519982796873"                -> "+5519982796873"
--      null                            -> null
-- -----------------------------------------------------------------------------
create or replace function public.normalize_whatsapp_jid(raw text)
returns text
language plpgsql
immutable
as $$
declare
  cleaned text;
begin
  if raw is null or length(trim(raw)) = 0 then
    return null;
  end if;

  -- remove o sufixo @s.whatsapp.net (ou @g.us, @c.us, etc.) e tudo após @
  cleaned := split_part(raw, '@', 1);

  -- mantém só dígitos
  cleaned := regexp_replace(cleaned, '\D', '', 'g');

  if length(cleaned) = 0 then
    return null;
  end if;

  -- garante prefixo +
  return '+' || cleaned;
end;
$$;


-- -----------------------------------------------------------------------------
-- 2. Trigger BEFORE INSERT em expenses
-- -----------------------------------------------------------------------------
create or replace function public.resolve_expense_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized text;
begin
  -- já veio com user_id? respeita.
  if new.user_id is not null then
    return new;
  end if;

  normalized := public.normalize_whatsapp_jid(new.whatsapp_number);

  if normalized is null then
    raise exception
      'Despesa sem user_id e sem whatsapp_number válido (recebido: %)',
      new.whatsapp_number;
  end if;

  select id into new.user_id
  from public.profiles
  where whatsapp_phone = normalized;

  if new.user_id is null then
    raise exception
      'Nenhum profile encontrado para whatsapp_number=% (normalizado: %)',
      new.whatsapp_number, normalized;
  end if;

  return new;
end;
$$;

drop trigger if exists expenses_resolve_user on public.expenses;
create trigger expenses_resolve_user
  before insert on public.expenses
  for each row
  execute function public.resolve_expense_user();


-- -----------------------------------------------------------------------------
-- 3. Backfill — preenche user_id nas despesas que estão null usando o
--    whatsapp_number já gravado por elas.
-- -----------------------------------------------------------------------------
update public.expenses e
set user_id = p.id
from public.profiles p
where e.user_id is null
  and e.whatsapp_number is not null
  and p.whatsapp_phone = public.normalize_whatsapp_jid(e.whatsapp_number);


-- =============================================================================
-- FIM
-- =============================================================================
-- A PARTIR DE AGORA:
--   O agente pode continuar inserindo do jeito que já faz, sem mudar nada:
--
--     insert into expenses (amount, description, category, occurred_at,
--                           raw_message, whatsapp_number)
--     values (5000, 'lanche', 'alimentacao', current_date,
--             'gastei 50 reais em lanche', '5519982796873@s.whatsapp.net');
--
--   O trigger resolve o user_id automaticamente. Se o número não bater com
--   nenhum profile, o insert FALHA com mensagem clara (em vez de gravar
--   uma despesa órfã que ninguém vê).
-- =============================================================================
