-- Schema privado: funções auxiliares que não devem ser expostas pela API.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated, service_role;

-- Limita o "Sobre mim" a 2.000 caracteres somando todos os parágrafos.
-- A validação do painel aplica o mesmo limite; esta restrição garante no banco.
create or replace function private.text_array_char_length(items text[])
returns integer
language sql
immutable
set search_path = ''
as $$
  select coalesce(sum(char_length(item)), 0)::integer from unnest(items) as item;
$$;

revoke all on function private.text_array_char_length(text[]) from public, anon;
grant execute on function private.text_array_char_length(text[]) to authenticated, service_role;

alter table public.profile_settings
  add constraint profile_settings_about_max_2000
  check (private.text_array_char_length(about) <= 2000);

-- Papel no projeto (ex.: "Colaborador") para trabalhos que não são autorais.
alter table public.projects
  add column if not exists role text check (role is null or char_length(role) between 1 and 60);
