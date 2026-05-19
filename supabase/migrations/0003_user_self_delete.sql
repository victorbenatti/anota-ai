-- =============================================================================
-- ANOTA-AI · Migration 0003 — Auto-exclusão de conta (LGPD)
-- =============================================================================
-- Permite que o usuário autenticado delete a própria conta a partir do app,
-- sem precisar de service_role no client.
--
-- Como funciona:
--   - Função SECURITY DEFINER roda com privilégios elevados (necessário pra
--     mexer em auth.users)
--   - Só apaga a linha onde id = auth.uid() — o usuário só pode deletar a si
--     mesmo, nunca outras contas
--   - Cascade já configurada nas migrations anteriores limpa profiles e
--     expenses automaticamente
--
-- Chamada no client:
--   await supabase.rpc('delete_current_user')
-- =============================================================================

create or replace function public.delete_current_user()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  uid uuid;
begin
  uid := auth.uid();
  if uid is null then
    raise exception 'Usuário não autenticado';
  end if;

  delete from auth.users where id = uid;
end;
$$;

-- Apenas usuários autenticados podem chamar (não anônimos)
revoke all on function public.delete_current_user() from public, anon;
grant execute on function public.delete_current_user() to authenticated;
