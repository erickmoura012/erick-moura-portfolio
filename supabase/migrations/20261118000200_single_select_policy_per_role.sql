-- Performance Advisor (multiple_permissive_policies): cada tabela de conteúdo tinha
-- duas políticas de SELECT permissivas para `authenticated` (leitura pública e
-- "admin lê tudo"), avaliadas uma a uma em toda consulta.
--
-- Agora há exatamente uma política de leitura por papel:
--   anon          → só o que está publicado (sem tocar em is_admin(), que o anon
--                   não pode executar);
--   authenticated → publicado OU admin, numa única expressão.
-- O resultado das consultas é o mesmo de antes.

begin;

do $$
declare
  t text;
begin
  foreach t in array array['experiences', 'skills', 'education', 'projects'] loop
    execute format('drop policy if exists %I on public.%I', t || ': leitura pública do que está publicado', t);
    execute format('drop policy if exists %I on public.%I', t || ': admin lê tudo', t);

    execute format(
      'create policy %I on public.%I for select to anon using (published)',
      t || ': leitura pública do que está publicado',
      t
    );
    execute format(
      'create policy %I on public.%I for select to authenticated using (published or (select private.is_admin()))',
      t || ': leitura autenticada (publicado ou admin)',
      t
    );
  end loop;
end
$$;

commit;
