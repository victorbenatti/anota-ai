-- =============================================================================
-- ANOTA-AI · Migration 0004 — Receitas e lançamentos financeiros
-- =============================================================================
-- Evolui a tabela `expenses` para suportar receitas sem migrar dados para uma
-- tabela nova. Registros antigos continuam válidos e passam a ser despesas.
-- =============================================================================

alter table public.expenses
  add column if not exists transaction_type text;

update public.expenses
set transaction_type = 'expense'
where transaction_type is null;

alter table public.expenses
  alter column transaction_type set default 'expense',
  alter column transaction_type set not null;

alter table public.expenses
  drop constraint if exists expenses_transaction_type_check;

alter table public.expenses
  add constraint expenses_transaction_type_check
  check (transaction_type in ('expense', 'income'));

create index if not exists expenses_user_type_occurred_at_idx
  on public.expenses (user_id, transaction_type, occurred_at desc);

comment on column public.expenses.transaction_type is
  'Tipo do lançamento financeiro: expense para despesa, income para receita. Amount permanece positivo em centavos.';

-- Realtime já foi habilitado na migration 0001 para a tabela expenses.

-- =============================================================================
-- FIM
-- =============================================================================
