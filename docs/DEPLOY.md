# Publicação e manutenção

Guia passo a passo para colocar o portfólio no ar e mantê-lo. Nada aqui é executado
automaticamente: cada etapa externa (GitHub, Vercel, Supabase) é feita por você.

## 1. Repositório no GitHub

O projeto já está versionado localmente, com commits semânticos. Para publicar:

1. Crie um repositório **vazio** em <https://github.com/new> com o nome `erick-moura-portfolio`
   (sem README, sem `.gitignore` e sem licença, para não conflitar com o histórico local).
2. Conecte e envie:

   ```bash
   git remote add origin https://github.com/erickmoura012/erick-moura-portfolio.git
   git push -u origin main
   ```

3. Em **Settings → Actions → General**, mantenha as Actions habilitadas: o workflow de CI
   (`.github/workflows/ci.yml`) roda tipos, lint, testes, build e E2E a cada push e PR.

## 2. Supabase (backend opcional, recomendado)

Sem Supabase, o site funciona com o conteúdo versionado. O formulário de contato aparece
como "em configuração" e o painel `/admin` mostra o que falta configurar.

1. Crie um projeto em <https://supabase.com/dashboard> (região sugerida: São Paulo, `sa-east-1`).
2. Vincule e aplique o schema, sem instalar nada globalmente:

   ```bash
   npx supabase login
   npx supabase link --project-ref <ref-do-projeto>
   npx supabase db push                   # aplica supabase/migrations
   ```

3. Carregue o conteúdo inicial com `npx supabase db push --include-seed` (ou cole
   `supabase/seed.sql` no **SQL Editor**). O seed é idempotente, gerado a partir de
   `src/content` com `npm run seed:generate`, e nunca sobrescreve o e-mail público nem o
   currículo definidos pelo painel.
4. Crie o usuário administrador. Em **Authentication → Users → Add user**, informe e-mail e
   senha forte e marque _Auto Confirm User_. Depois, no **SQL Editor**:

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'SEU-EMAIL-AQUI';
   ```

   Só usuários presentes em `admin_users` passam pelas políticas de RLS.

5. Em **Authentication → Sign In / Providers**, desligue _Allow new users to sign up_
   (o `config.toml` já faz isso localmente, mas o projeto hospedado tem configuração
   própria). Em **URL Configuration**, defina a _Site URL_ com o domínio de produção.
6. Configure os segredos das Edge Functions (descritos em `supabase/functions/.env.example`):

   ```bash
   npx supabase secrets set ALLOWED_ORIGINS=https://seu-dominio.com,https://erick-moura-portfolio.vercel.app
   npx supabase secrets set RATE_LIMIT_SALT=$(openssl rand -hex 32)
   # E-mail (opcional; sem ele as mensagens ficam só no painel):
   npx supabase secrets set RESEND_API_KEY=... CONTACT_TO_EMAIL=... CONTACT_FROM_EMAIL="Portfólio <contato@seu-dominio.com>"
   # GitHub (opcional; habilita o calendário de contribuições):
   npx supabase secrets set GITHUB_TOKEN=...
   ```

   O `GITHUB_TOKEN` deve ser um _fine-grained token_ **sem nenhuma permissão de
   repositório** (acesso apenas a dados públicos), com validade definida.

7. Publique as funções:

   ```bash
   npx supabase functions deploy contact
   npx supabase functions deploy github-sync
   ```

8. _(Opcional)_ Agende a sincronização do GitHub. Defina `CRON_SECRET` e agende uma chamada
   `POST https://<ref>.supabase.co/functions/v1/github-sync` com o cabeçalho
   `x-cron-secret`, por exemplo a cada 6 horas (Supabase Cron, `pg_cron` + `pg_net` ou um
   cron externo). Também é possível sincronizar manualmente pelo painel, em **GitHub**.

## 3. Vercel

A Vercel foi escolhida por já hospedar os outros projetos (Finity e MenuFlow), detectar
Vite, servir os HTML pré-renderizados com URLs limpas e aplicar os headers de segurança
de `vercel.json`.

1. Em <https://vercel.com/new>, importe o repositório `erick-moura-portfolio`.
   O framework (Vite), o comando de build e a pasta `dist` vêm de `vercel.json`.
2. Em **Settings → Environment Variables** (Production e Preview):

   | Variável                        | Valor                                                                               |
   | ------------------------------- | ----------------------------------------------------------------------------------- |
   | `VITE_SITE_URL`                 | URL pública, ex.: `https://seu-dominio.com` (vazia = domínio de produção da Vercel) |
   | `VITE_SUPABASE_URL`             | `https://<ref>.supabase.co`                                                         |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | chave _publishable_ (ou _anon_) do projeto                                          |
   | `VITE_GITHUB_USERNAME`          | `erickmoura012`                                                                     |

   Nunca cadastre a `service_role` na Vercel: ela só existe nas Edge Functions.

3. Faça o deploy. Cada push na `main` publica em produção, e cada PR gera um preview.
4. Domínio próprio: **Settings → Domains → Add**, configure o DNS indicado, atualize
   `VITE_SITE_URL` e `ALLOWED_ORIGINS` e faça um novo deploy (o sitemap e a URL canônica
   são gerados no build).

## 4. Checklist de produção

- [ ] `npm run check` passa localmente (tipos, lint, testes e build)
- [ ] CI verde no GitHub (inclui E2E e axe em desktop e mobile)
- [ ] Variáveis da Vercel definidas; `VITE_SITE_URL` aponta para o domínio final
- [ ] Migration aplicada, seed carregado e administrador criado em `admin_users`
- [ ] `ALLOWED_ORIGINS` contém exatamente os domínios do site
- [ ] Formulário testado em produção: mensagem aparece em **Mensagens** no painel (e chega por e-mail, se configurado)
- [ ] Currículo PDF enviado pelo painel (**Perfil → Currículo (PDF)**); o botão "Baixar currículo" só aparece depois disso
- [ ] Lighthouse em produção, no mobile e no desktop, conferido e registrado
- [ ] `https://seu-dominio.com/sitemap.xml` e `/robots.txt` acessíveis; site enviado ao Google Search Console
- [ ] Imagem de compartilhamento validada (ex.: Post Inspector do LinkedIn)

## 5. Manutenção

| Tarefa                                                      | Como fazer                                                                                                                                                    |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Atualizar textos, projetos, skills, experiências e formação | Painel `/admin` (sem deploy). Para o HTML pré-renderizado e o fallback refletirem a mudança, atualize também `src/content/`                                   |
| Destacar um projeto ou definir o principal                  | Painel → Projetos → _Destaque_ / _Projeto principal_                                                                                                          |
| Atualizar o snapshot do GitHub (fallback)                   | `npm run sync:github` e commit de `src/data/github-snapshot.json`                                                                                             |
| Novas capturas das demonstrações                            | `npm run assets:screenshots` e commit de `public/projects/`                                                                                                   |
| Regenerar imagem OG e ícones                                | `npm run assets:og`                                                                                                                                           |
| Regerar o seed a partir do conteúdo versionado              | `npm run seed:generate`                                                                                                                                       |
| Analisar o tamanho do bundle                                | `npm run analyze` e abrir `stats.html`                                                                                                                        |
| Atualizar dependências                                      | `npm outdated`, atualizar em lotes pequenos e rodar `npm run check` + `npm run test:e2e`                                                                      |
| Alterar `public/theme-init.js`                              | O build embute esse script e confere o hash na CSP de `vercel.json`; se mudar, o build falha e mostra o novo valor de `sha256-…` para colocar em `script-src` |
| Ler mensagens de contato                                    | Painel → Mensagens (marque como lida/arquivada)                                                                                                               |

## 6. Solução de problemas

- **Formulário retorna erro 403** — a origem do site não está em `ALLOWED_ORIGINS`.
- **Seção do GitHub com aviso de dados desatualizados** — a API pública atingiu o limite
  de 60 req/h para aquele IP. O site exibe o último dado válido; com `github-sync`
  agendado, os visitantes passam a ler do Supabase.
- **`/admin` diz "Acesso negado"** — o usuário existe no Auth, mas não está em `public.admin_users`.
- **Canonical/sitemap ausentes no build** — `VITE_SITE_URL` vazia fora da Vercel. Defina-a e gere o build de novo.
