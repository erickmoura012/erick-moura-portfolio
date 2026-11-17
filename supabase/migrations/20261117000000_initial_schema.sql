-- ─────────────────────────────────────────────────────────────────────────────
-- Portfólio Erick Moura — schema inicial
--
-- Princípios de segurança:
--   • Row Level Security ligado em TODAS as tabelas.
--   • Visitantes (anon) só leem conteúdo publicado; nunca escrevem.
--   • Escrita exige public.is_admin() — a autorização vive no banco, não na UI.
--   • Mensagens de contato só entram pela Edge Function (service role) e só
--     são lidas por administradores.
--   • Privilégios concedidos explicitamente, sem depender dos padrões do projeto.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Funções utilitárias ──────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Administradores ──────────────────────────────────────────────────────────

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Usuários autorizados a administrar o portfólio. Linhas são inseridas manualmente (SQL), nunca pelo cliente.';

-- SECURITY DEFINER para consultar admin_users sem expor a tabela; search_path
-- vazio evita sequestro de resolução de nomes.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated, service_role;

-- ── Conteúdo editorial ───────────────────────────────────────────────────────

create table public.profile_settings (
  locale text primary key default 'pt-BR',
  name text not null check (char_length(name) between 1 and 120),
  full_name text not null check (char_length(full_name) between 1 and 160),
  headline text not null check (char_length(headline) between 1 and 200),
  roles text[] not null default '{}',
  tagline text not null check (char_length(tagline) between 1 and 400),
  about text[] not null default '{}',
  github_url text not null check (github_url ~ '^https://'),
  linkedin_url text not null check (linkedin_url ~ '^https://'),
  public_email text check (public_email is null or public_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  resume_url text check (resume_url is null or resume_url ~ '^(https://|/)'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experiences (
  id text primary key default gen_random_uuid()::text,
  locale text not null default 'pt-BR',
  company text not null check (char_length(company) between 1 and 160),
  role text not null check (char_length(role) between 1 and 160),
  location text,
  period_label text not null check (char_length(period_label) between 1 and 80),
  is_current boolean not null default false,
  summary text not null,
  activities text[] not null default '{}',
  tags text[] not null default '{}',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skills (
  id text primary key default gen_random_uuid()::text,
  locale text not null default 'pt-BR',
  name text not null check (char_length(name) between 1 and 80),
  category text not null check (category in ('frontend', 'backend', 'ai', 'tools', 'platforms')),
  level text not null check (level in ('professional', 'projects', 'learning')),
  description text not null,
  icon text not null check (char_length(icon) between 1 and 60),
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.education (
  id text primary key default gen_random_uuid()::text,
  locale text not null default 'pt-BR',
  kind text not null check (kind in ('degree', 'course', 'certification')),
  title text not null check (char_length(title) between 1 and 200),
  institution text not null check (char_length(institution) between 1 and 200),
  location text,
  status text not null check (status in ('in_progress', 'completed')),
  period_label text,
  description text,
  credential_url text check (credential_url is null or credential_url ~ '^https://'),
  topics text[] not null default '{}',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id text primary key default gen_random_uuid()::text,
  locale text not null default 'pt-BR',
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  repo_name text,
  title text not null check (char_length(title) between 1 and 120),
  tagline text not null check (char_length(tagline) between 1 and 200),
  description text not null,
  challenge text,
  solution text,
  features text[] not null default '{}',
  architecture text[] not null default '{}',
  highlights text[] not null default '{}',
  stack text[] not null default '{}',
  screenshots jsonb not null default '[]'::jsonb check (jsonb_typeof(screenshots) = 'array'),
  repo_url text check (repo_url is null or repo_url ~ '^https://'),
  demo_url text check (demo_url is null or demo_url ~ '^https://'),
  category text not null check (category in ('web', 'automation', 'ai', 'integration')),
  featured boolean not null default false,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (locale, slug)
);

-- Só um projeto principal por idioma: ao marcar um, os demais são desmarcados
-- na mesma transação (roda com os privilégios — e o RLS — de quem fez a alteração).
create or replace function public.enforce_single_primary_project()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.is_primary then
    update public.projects
    set is_primary = false
    where locale = new.locale
      and id <> new.id
      and is_primary;
  end if;
  return new;
end;
$$;

create trigger projects_single_primary
  after insert or update of is_primary on public.projects
  for each row
  when (new.is_primary)
  execute function public.enforce_single_primary_project();

-- ── Mensagens de contato ─────────────────────────────────────────────────────

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) <= 254),
  subject text not null check (char_length(subject) between 3 and 120),
  message text not null check (char_length(message) between 20 and 4000),
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  email_status text not null default 'pending'
    check (email_status in ('pending', 'sent', 'failed', 'skipped')),
  -- Hash salgado do IP (nunca o IP em si), usado apenas para rate limiting.
  ip_hash text,
  user_agent text check (user_agent is null or char_length(user_agent) <= 300)
);

-- ── Cache da sincronização com o GitHub ──────────────────────────────────────

create table public.github_sync_metadata (
  id smallint primary key default 1 check (id = 1),
  payload jsonb,
  synced_at timestamptz,
  status text not null default 'success' check (status in ('success', 'error')),
  error_message text,
  updated_at timestamptz not null default now()
);

comment on table public.github_sync_metadata is
  'Linha única (id = 1) com os dados públicos do GitHub coletados pela Edge Function github-sync.';

-- ── Gatilhos de updated_at ───────────────────────────────────────────────────

create trigger profile_settings_set_updated_at
  before update on public.profile_settings
  for each row execute function public.set_updated_at();

create trigger experiences_set_updated_at
  before update on public.experiences
  for each row execute function public.set_updated_at();

create trigger skills_set_updated_at
  before update on public.skills
  for each row execute function public.set_updated_at();

create trigger education_set_updated_at
  before update on public.education
  for each row execute function public.set_updated_at();

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create trigger github_sync_metadata_set_updated_at
  before update on public.github_sync_metadata
  for each row execute function public.set_updated_at();

-- ── Índices ──────────────────────────────────────────────────────────────────

create index experiences_public_idx on public.experiences (locale, published, sort_order);
create index skills_public_idx on public.skills (locale, published, sort_order);
create index education_public_idx on public.education (locale, published, sort_order);
create index projects_public_idx on public.projects (locale, published, sort_order);
create index contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index contact_messages_rate_limit_idx on public.contact_messages (ip_hash, created_at);

-- ── Row Level Security ───────────────────────────────────────────────────────

alter table public.admin_users enable row level security;
alter table public.profile_settings enable row level security;
alter table public.experiences enable row level security;
alter table public.skills enable row level security;
alter table public.education enable row level security;
alter table public.projects enable row level security;
alter table public.contact_messages enable row level security;
alter table public.github_sync_metadata enable row level security;

-- admin_users: cada usuário enxerga apenas a própria linha; ninguém escreve pelo cliente.
create policy "admin_users: ler a própria linha"
  on public.admin_users for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Conteúdo: duas políticas de leitura somadas (OR). A pública não referencia
-- is_admin(), então o papel anon nunca precisa de permissão sobre a função.
-- Resultado: published OR is_admin().

-- experiences
create policy "experiences: leitura pública do que está publicado"
  on public.experiences for select
  to anon, authenticated
  using (published);
create policy "experiences: admin lê tudo"
  on public.experiences for select
  to authenticated
  using ((select public.is_admin()));
create policy "experiences: admin insere"
  on public.experiences for insert
  to authenticated
  with check ((select public.is_admin()));
create policy "experiences: admin atualiza"
  on public.experiences for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
create policy "experiences: admin exclui"
  on public.experiences for delete
  to authenticated
  using ((select public.is_admin()));

-- skills
create policy "skills: leitura pública do que está publicado"
  on public.skills for select
  to anon, authenticated
  using (published);
create policy "skills: admin lê tudo"
  on public.skills for select
  to authenticated
  using ((select public.is_admin()));
create policy "skills: admin insere"
  on public.skills for insert
  to authenticated
  with check ((select public.is_admin()));
create policy "skills: admin atualiza"
  on public.skills for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
create policy "skills: admin exclui"
  on public.skills for delete
  to authenticated
  using ((select public.is_admin()));

-- education
create policy "education: leitura pública do que está publicado"
  on public.education for select
  to anon, authenticated
  using (published);
create policy "education: admin lê tudo"
  on public.education for select
  to authenticated
  using ((select public.is_admin()));
create policy "education: admin insere"
  on public.education for insert
  to authenticated
  with check ((select public.is_admin()));
create policy "education: admin atualiza"
  on public.education for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
create policy "education: admin exclui"
  on public.education for delete
  to authenticated
  using ((select public.is_admin()));

-- projects
create policy "projects: leitura pública do que está publicado"
  on public.projects for select
  to anon, authenticated
  using (published);
create policy "projects: admin lê tudo"
  on public.projects for select
  to authenticated
  using ((select public.is_admin()));
create policy "projects: admin insere"
  on public.projects for insert
  to authenticated
  with check ((select public.is_admin()));
create policy "projects: admin atualiza"
  on public.projects for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
create policy "projects: admin exclui"
  on public.projects for delete
  to authenticated
  using ((select public.is_admin()));

-- profile_settings: leitura pública, escrita só de admin.
create policy "profile_settings: leitura pública"
  on public.profile_settings for select
  to anon, authenticated
  using (true);
create policy "profile_settings: admin insere"
  on public.profile_settings for insert
  to authenticated
  with check ((select public.is_admin()));
create policy "profile_settings: admin atualiza"
  on public.profile_settings for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- github_sync_metadata: leitura pública; escrita apenas pela service role
-- (que ignora RLS), portanto não há políticas de escrita.
create policy "github_sync_metadata: leitura pública"
  on public.github_sync_metadata for select
  to anon, authenticated
  using (true);

-- contact_messages: nenhuma política para anon. Inserções acontecem apenas
-- pela Edge Function `contact`, com a service role.
create policy "contact_messages: admin lê"
  on public.contact_messages for select
  to authenticated
  using ((select public.is_admin()));
create policy "contact_messages: admin atualiza status"
  on public.contact_messages for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
create policy "contact_messages: admin exclui"
  on public.contact_messages for delete
  to authenticated
  using ((select public.is_admin()));

-- ── Privilégios (mínimo necessário por papel) ────────────────────────────────

grant usage on schema public to anon, authenticated, service_role;

revoke all on table
  public.admin_users,
  public.profile_settings,
  public.experiences,
  public.skills,
  public.education,
  public.projects,
  public.contact_messages,
  public.github_sync_metadata
from public, anon, authenticated;

-- Visitantes: somente leitura do conteúdo (o RLS filtra o que está publicado).
grant select on table
  public.profile_settings,
  public.experiences,
  public.skills,
  public.education,
  public.projects,
  public.github_sync_metadata
to anon, authenticated;

-- Usuários autenticados: o RLS restringe a escrita a administradores.
grant insert, update, delete on table
  public.experiences,
  public.skills,
  public.education,
  public.projects
to authenticated;

grant insert, update on table public.profile_settings to authenticated;

grant select on table public.admin_users to authenticated;

-- Mensagens: admin lê e exclui; só a coluna `status` pode ser alterada.
grant select, delete on table public.contact_messages to authenticated;
grant update (status) on table public.contact_messages to authenticated;

-- Edge Functions (service role).
grant all on table
  public.admin_users,
  public.profile_settings,
  public.experiences,
  public.skills,
  public.education,
  public.projects,
  public.contact_messages,
  public.github_sync_metadata
to service_role;

-- ── Storage: imagens de projetos e currículo ─────────────────────────────────

-- Bucket público: os arquivos são servidos pela URL pública sem política de
-- leitura para anon (o que também impede a listagem do bucket por visitantes).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-assets',
  'portfolio-assets',
  true,
  5242880, -- 5 MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'application/pdf']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "portfolio-assets: admin lista"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'portfolio-assets' and (select public.is_admin()));

create policy "portfolio-assets: admin envia"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-assets' and (select public.is_admin()));

create policy "portfolio-assets: admin substitui"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-assets' and (select public.is_admin()))
  with check (bucket_id = 'portfolio-assets' and (select public.is_admin()));

create policy "portfolio-assets: admin exclui"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-assets' and (select public.is_admin()));
