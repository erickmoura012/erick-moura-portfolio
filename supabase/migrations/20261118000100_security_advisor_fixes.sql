-- Correções apontadas pelo Security Advisor do Supabase.

-- 1) is_admin() sai do schema exposto pela API (public) para um schema privado.
--    As políticas de RLS continuam funcionando: o Postgres as vincula à função pelo
--    identificador interno, não pelo nome. O painel deixou de chamar a função via
--    RPC e passou a ler a própria linha em admin_users.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated, service_role;

alter function public.is_admin() set schema private;

revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated, service_role;

-- 2) rls_auto_enable() é a função do gatilho "Enable automatic RLS", criada pelo
--    Supabase. Ela só deve rodar pelo gatilho de eventos; ninguém precisa chamá-la
--    pela API. O gatilho continua funcionando sem o privilégio EXECUTE dos papéis.
do $$
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'rls_auto_enable'
  ) then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end;
$$;
