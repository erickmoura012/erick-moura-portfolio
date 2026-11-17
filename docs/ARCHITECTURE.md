# Arquitetura

Este documento explica como o portfólio é organizado e por que cada decisão foi tomada.

## Visão geral

```text
                        ┌──────────────────────────────┐
  Visitante ──HTTPS──▶  │ Vercel (CDN)                 │
                        │  HTML pré-renderizado + JS   │
                        └──────────────┬───────────────┘
                                       │ hidratação (React)
              ┌────────────────────────┼─────────────────────────┐
              ▼                        ▼                         ▼
   Conteúdo estático         API pública do GitHub        Supabase (opcional)
   (src/content, snapshot)   (sem token, com cache)       ├─ Postgres + RLS (conteúdo, mensagens)
   — sempre disponível        — 60 req/h por IP            ├─ Auth (painel /admin)
                                                           ├─ Storage (imagens, currículo)
                                                           └─ Edge Functions
                                                               ├─ contact      (e-mail via Resend)
                                                               └─ github-sync  (token + contribuições)
```

O site **funciona completo sem nenhum backend**: o conteúdo editorial está versionado
em `src/content/` e os dados do GitHub têm um snapshot em `src/data/github-snapshot.json`.
O Supabase acrescenta edição pelo painel, formulário de contato e dados do GitHub
sincronizados no servidor — e, quando falha, cada bloco cai de volta no conteúdo estático.

## Decisões principais

| Decisão                                                                 | Motivo                                                                                                                                                                                      |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vite + React + pré-renderização própria** em vez de um meta-framework | Mantém React + Vite como base (requisito) e ainda entrega HTML completo para SEO e primeira pintura rápida. `scripts/prerender.ts` usa `react-dom/static` com o bundle SSR do Vite.         |
| **Conteúdo estático como fonte primária**                               | Zero dependência para o site existir; o HTML pré-renderizado já traz o conteúdo real; o seed do banco é gerado a partir dele.                                                               |
| **Supabase carregado sob demanda**                                      | O SDK só é baixado quando há configuração (`src/lib/supabase.ts`); o painel admin é um chunk separado que visitantes nunca baixam.                                                          |
| **Snapshot + cache + API pública para o GitHub**                        | Respeita o limite de 60 req/h sem expor token; o visitante sempre vê dados (com aviso quando estão desatualizados).                                                                         |
| **Módulos compartilhados em `supabase/functions/_shared`**              | O mesmo código de coleta do GitHub e o mesmo schema Zod do contato rodam no navegador, no Node (scripts) e no Deno (Edge Functions). É o único diretório que o bundler das funções enxerga. |
| **Tokens semânticos de cor**                                            | Os componentes usam `bg-surface`, `text-muted` etc.; o tema claro é só uma nova atribuição das variáveis em `src/app/styles/index.css`.                                                     |
| **Sem barras de porcentagem nas skills**                                | Níveis descritivos e verificáveis: _uso profissional_, _projetos próprios_, _em aprendizado_.                                                                                               |

## Estrutura de pastas

```text
src/
├── app/                 Composição: App, providers, rotas, estilos globais, âncoras das seções
├── components/
│   ├── ui/              Primitivos do design system (Button, Card, Badge, Form, Dialog…)
│   ├── common/          Logo, ícones de marca/tecnologia, ThemeToggle, ErrorBoundary
│   ├── layout/          Navbar, MobileMenu, Footer, Section, overlays globais
│   └── animations/      Reveal, RotatingText, curvas de easing
├── features/            Uma pasta por área — componentes, hooks e regras juntos
│   ├── home/ about/ experience/ skills/ solutions/ education/
│   ├── projects/        Destaques, explorador de repositórios (busca/filtro/ordenação), estudo de caso
│   ├── github/          Fonte de dados (cache/snapshot), seletores, gráficos do dashboard
│   ├── contact/         Formulário (RHF + Zod), envio para a Edge Function
│   ├── command-palette/ Ctrl/Cmd+K (cmdk)
│   ├── terminal/        Modo terminal com comandos fechados
│   ├── not-found/       Página 404
│   └── admin/           Painel administrativo (chunk separado)
├── content/pt-BR/       Conteúdo editorial tipado
├── i18n/                Dicionário de interface (pt-BR) e contexto de idioma
├── hooks/ lib/ services/ types/
├── data/                Snapshot do GitHub gerado por `npm run sync:github`
└── entry-server.tsx     Entrada da pré-renderização

supabase/
├── migrations/          Schema, RLS, políticas, storage
├── functions/           contact, github-sync e módulos _shared
└── seed.sql             Gerado a partir de src/content (`npm run seed:generate`)

scripts/                 prerender, sync-github, generate-seed, assets (OG e capturas)
tests/e2e/               Playwright + axe (desktop e mobile)
build/                   Plugins de build (SEO, URL do site)
```

## Fluxos de dados

### Conteúdo editorial

`usePortfolioContent()` devolve o conteúdo estático imediatamente (placeholder do
TanStack Query) e, com Supabase configurado, busca as linhas publicadas
(`published = true`) de `profile_settings`, `experiences`, `skills`, `education` e
`projects`. Cada tabela vazia ou com erro cai no conteúdo estático
correspondente. Colunas usam `snake_case` e a conversão para `camelCase` é mecânica.

### GitHub

`loadGithubData()` em `src/features/github/data-source.ts`, na ordem:

1. **Cache local** (`localStorage`, 1 h) — evita gastar o limite da API;
2. **Supabase** (`github_sync_metadata`) — dados sincronizados com token pela Edge Function, incluindo o calendário de contribuições (GraphQL);
3. **API pública** do GitHub, direto do navegador, sem token;
4. **Fallback** — cache vencido ou snapshot versionado, com aviso de dados desatualizados.

O calendário de contribuições só aparece quando existe sincronização autenticada:
o GitHub não o expõe pela API REST pública, e o site não simula esse dado.

### Contato

`ContactForm` valida com o schema compartilhado → `POST /functions/v1/contact`
→ a função revalida, verifica origem (CORS), honeypot, tempo mínimo de
preenchimento e rate limit por hash de IP → grava em `contact_messages` com a
service role → envia e-mail pela API da Resend se os segredos existirem.
Nenhuma credencial de e-mail existe no navegador.

### Painel administrativo

Rota `/admin/*`, fora do layout público e servida a partir de `spa.html` (sem
pré-renderização). Login por e-mail e senha no Supabase Auth, sem cadastro público.
A autorização real está no banco: `public.is_admin()` + RLS em todas as tabelas. O
bloqueio de rota na interface é apenas experiência de uso.

## Internacionalização

Textos de interface em `src/i18n/locales/pt-BR.ts` (o tipo `Messages` deriva dele);
conteúdo editorial em `src/content/pt-BR/` e coluna `locale` em todas as tabelas.
Para adicionar inglês:

1. criar `src/i18n/locales/en.ts` com `const en: Messages = { … }` e registrá-lo em `src/i18n/index.ts`;
2. criar `src/content/en/` e registrá-lo em `src/content/index.ts`;
3. ampliar o tipo `Locale` e definir a estratégia de URL (ex.: prefixo `/en`), incluindo as rotas em `getPrerenderRoutes()`.

## Performance

Medido com Lighthouse 12 sobre o build de produção (`vite preview`), perfil mobile
padrão (4G lento simulado, CPU 4×), mediana de 3 execuções, em 17/11/2026:

| Página                      | Performance | Acessibilidade | Boas práticas | SEO | FCP   | LCP   | CLS   |
| --------------------------- | ----------- | -------------- | ------------- | --- | ----- | ----- | ----- |
| `/` (mobile)                | 98          | 100            | 100*          | 100 | 1,7 s | 2,0 s | 0     |
| `/` (desktop)               | 100         | 100            | 100*          | 100 | 0,4 s | 0,5 s | 0,003 |
| `/projetos/finity` (mobile) | 99          | 100            | 100*          | 100 | 1,5 s | 2,0 s | 0     |

- 96 quando a cota anônima da API do GitHub (60 req/h por IP) está esgotada: o
  navegador registra o 403 no console. O site exibe os dados sincronizados normalmente
  e passa a pular a API até o horário de liberação. Com a sincronização pelo Supabase
  ativa, visitantes não chamam a API do GitHub. Os números precisam ser confirmados em
  produção, no domínio final.

O que levou a esses números, cada item verificado por medição:

1. **HTML pré-renderizado** para `/`, cada projeto em destaque e a 404, em arquivos
   planos (`projetos/finity.html`) que qualquer hospedagem estática serve em `/projetos/finity`.
2. **Nada bloqueia o primeiro paint**: o CSS e o script de tema vão embutidos no HTML
   (o script autorizado por hash na CSP; o build falha se o hash não bater).
3. **JavaScript depois do primeiro paint** (`public/boot.js`): numa página que já chega
   completa, o bundle não disputa banda com HTML, CSS e fontes. Na medição, isso levou
   o FCP mobile de 3,4 s para 1,7 s. Links e âncoras funcionam antes da hidratação;
   controles interativos (tema, busca, paleta) respondem assim que o JS chega.
4. **Seções sob demanda com hidratação seletiva**: abaixo da dobra, cada seção é um
   chunk próprio. O HTML já está na página e o React hidrata cada parte quando o código
   chega. A pré-renderização desativa o `progressiveChunkSize` para que o conteúdo saia
   inteiro e em ordem (legível sem JS e sem scripts inline).
5. **Code splitting**: painel admin, paleta de comandos, terminal, formulário (Zod + React
   Hook Form), recursos completos do Motion (`LazyMotion`) e SDK do Supabase ficam fora
   do bundle inicial.
6. **Imagens**: capturas em AVIF com fallback WebP, variantes de 640 e 1280 px via
   `srcset`/`sizes`, dimensões explícitas e `fetchpriority="high"` na imagem principal.
7. **Fontes** variáveis auto-hospedadas, `font-display: swap`, só os subconjuntos usados.

`npm run analyze` gera `stats.html` com a composição do bundle.

## Segurança

- Nenhum segredo no frontend: só `VITE_SUPABASE_URL` e a chave publicável, protegidas por RLS;
- RLS habilitado em todas as tabelas; `contact_messages` sem nenhum acesso anônimo;
- Edge Functions validam entrada com Zod, restringem origem e não registram dados pessoais;
- headers de segurança e CSP restritiva em `vercel.json` (`script-src 'self'`, sem scripts inline);
- links externos com `rel="noopener noreferrer"`; o terminal nunca avalia a entrada do visitante.
