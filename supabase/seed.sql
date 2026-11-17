-- Gerado por `npm run seed:generate` a partir de src/content/pt-BR — não edite à mão.
-- Idempotente: pode ser executado mais de uma vez. Não cria administradores.

begin;

insert into public.profile_settings (locale, name, full_name, headline, roles, tagline, about, github_url, linkedin_url, public_email, resume_url)
values
  ('pt-BR', 'Erick Moura', 'Erick Moura Almeida', 'Desenvolvedor Full Stack | Automações & Inteligência Artificial', array['Desenvolvedor Full Stack', 'Analista de Soluções', 'Especialista em Automações', 'Entusiasta de Inteligência Artificial']::text[], 'Transformo ideias e desafios reais em soluções digitais inteligentes, combinando desenvolvimento web, automações e Inteligência Artificial.', array['Sou estudante de Análise e Desenvolvimento de Sistemas e profissional de tecnologia. Meu trabalho acontece no ponto em que software e operação se encontram: entender um processo, desenhar a solução e colocá-la para funcionar com integrações, automações e Inteligência Artificial.', 'Hoje atuo como Analista de Soluções na Teté à Teté Marketing de Conversa, desenvolvendo e mantendo soluções integradas aos ecossistemas Frédy.app e Duda.app. No dia a dia, construo workflows no n8n, integro APIs REST a plataformas de CRM, configuro agentes conversacionais com IA e conecto sistemas de terceiros à WhatsApp Business API, com Redis apoiando a distribuição e o controle de estado dos fluxos.', 'Essa rotina une visão de negócio, atendimento técnico a clientes e implementação: levanto a demanda, documento, entrego e acompanho a solução em uso.', 'Em paralelo, estudo e desenvolvo aplicações web com HTML, CSS, JavaScript, TypeScript e React. Meu objetivo é evoluir de forma consistente como desenvolvedor Full Stack, aprofundar arquitetura de software e criar produtos digitais que resolvem problemas reais.']::text[], 'https://github.com/erickmoura012', 'https://www.linkedin.com/in/erickmouradev/', null, null)
on conflict (locale) do update set
  name = excluded.name,
  full_name = excluded.full_name,
  headline = excluded.headline,
  roles = excluded.roles,
  tagline = excluded.tagline,
  about = excluded.about,
  github_url = excluded.github_url,
  linkedin_url = excluded.linkedin_url;

insert into public.experiences (id, company, role, location, period_label, is_current, summary, activities, tags, sort_order, locale, published)
values
  ('tete-a-tete', 'Teté à Teté Marketing de Conversa', 'Analista de Soluções', 'Remoto', 'Jul 2026 — Atual', true, 'Desenvolvo e mantenho soluções tecnológicas integradas aos ecossistemas Frédy.app e Duda.app, do levantamento da demanda à implantação com o cliente.', array['Desenvolvimento e manutenção de workflows no n8n.', 'Integração de APIs REST com plataformas de CRM.', 'Configuração de agentes conversacionais com Inteligência Artificial.', 'Integração com a WhatsApp Business API.', 'Automação de processos comerciais e operacionais.', 'Uso de Redis em fluxos de distribuição e controle de estados.', 'Integração de serviços financeiros e de telefonia.', 'Suporte técnico e atendimento a clientes via chat.', 'Levantamento e documentação de demandas.', 'Treinamento de usuários e implantação de soluções.', 'Manutenção de sistemas e melhoria contínua de processos.']::text[], array['n8n', 'APIs REST', 'Redis', 'OpenAI', 'WhatsApp API', 'CRM', 'Webhooks', 'JSON']::text[], 1, 'pt-BR', true),
  ('sabor-baiano', 'Restaurante Sabor Baiano', 'Gerente Administrativo', null, '2019 — 2026', false, 'Anos à frente da operação de um restaurante formaram a base que hoje aplico em tecnologia: enxergar processos de ponta a ponta, priorizar demandas e resolver problemas com o cliente no centro.', array['Gestão da operação diária, com foco em organização e eficiência dos processos.', 'Atendimento ao público e comunicação direta com clientes.', 'Resolução de problemas e tomada de decisão em situações de pressão.', 'Gestão de demandas e coordenação de equipes.', 'Organização e melhoria de processos administrativos.']::text[], array['Gestão de processos', 'Atendimento ao cliente', 'Resolução de problemas', 'Gestão de equipes', 'Comunicação']::text[], 2, 'pt-BR', true)
on conflict (id) do update set
  company = excluded.company,
  role = excluded.role,
  location = excluded.location,
  period_label = excluded.period_label,
  is_current = excluded.is_current,
  summary = excluded.summary,
  activities = excluded.activities,
  tags = excluded.tags,
  sort_order = excluded.sort_order,
  locale = excluded.locale,
  published = excluded.published;

insert into public.skills (name, icon, level, description, category, id, sort_order, locale, published)
values
  ('HTML5', 'html5', 'projects', 'Marcação semântica e acessível.', 'frontend', 'frontend-html5', 1, 'pt-BR', true),
  ('CSS3', 'css', 'projects', 'Layouts responsivos, Flexbox e Grid.', 'frontend', 'frontend-css', 2, 'pt-BR', true),
  ('JavaScript', 'javascript', 'projects', 'Lógica de interface e consumo de APIs.', 'frontend', 'frontend-javascript', 3, 'pt-BR', true),
  ('TypeScript', 'typescript', 'projects', 'Tipagem estática para código mais seguro.', 'frontend', 'frontend-typescript', 4, 'pt-BR', true),
  ('React', 'react', 'projects', 'Componentes, hooks e gerenciamento de estado.', 'frontend', 'frontend-react', 5, 'pt-BR', true),
  ('Tailwind CSS', 'tailwindcss', 'projects', 'Estilização utilitária e design systems.', 'frontend', 'frontend-tailwindcss', 6, 'pt-BR', true),
  ('Sass', 'sass', 'learning', 'Partials, variáveis e mixins — usado no Finity.', 'frontend', 'frontend-sass', 7, 'pt-BR', true),
  ('Next.js', 'nextdotjs', 'learning', 'App Router e rotas de API — usado no RZE Sites.', 'frontend', 'frontend-nextdotjs', 8, 'pt-BR', true),
  ('APIs REST', 'api', 'professional', 'Consumo e integração de serviços HTTP.', 'backend', 'backend-api', 9, 'pt-BR', true),
  ('Webhooks', 'webhook', 'professional', 'Eventos em tempo real entre sistemas.', 'backend', 'backend-webhook', 10, 'pt-BR', true),
  ('n8n', 'n8n', 'professional', 'Workflows de automação e orquestração.', 'backend', 'backend-n8n', 11, 'pt-BR', true),
  ('Redis', 'redis', 'professional', 'Distribuição e controle de estado em fluxos.', 'backend', 'backend-redis', 12, 'pt-BR', true),
  ('JSON', 'json', 'professional', 'Modelagem e transformação de dados.', 'backend', 'backend-json', 13, 'pt-BR', true),
  ('Integrações entre sistemas', 'integration', 'professional', 'Conexão de CRMs, serviços financeiros e de telefonia.', 'backend', 'backend-integration', 14, 'pt-BR', true),
  ('Node.js', 'nodedotjs', 'learning', 'Base para evoluir no backend JavaScript.', 'backend', 'backend-nodedotjs', 15, 'pt-BR', true),
  ('PostgreSQL', 'postgresql', 'learning', 'Modelagem relacional e SQL.', 'backend', 'backend-postgresql', 16, 'pt-BR', true),
  ('OpenAI API', 'openai', 'professional', 'Modelos de linguagem em fluxos de atendimento.', 'ai', 'ai-openai', 17, 'pt-BR', true),
  ('Engenharia de Prompt', 'prompt', 'professional', 'Instruções e contexto para agentes.', 'ai', 'ai-prompt', 18, 'pt-BR', true),
  ('Agentes Conversacionais', 'agent', 'professional', 'Configuração de agentes de IA para atendimento.', 'ai', 'ai-agent', 19, 'pt-BR', true),
  ('Automação com IA', 'ai-automation', 'professional', 'IA aplicada a processos do negócio.', 'ai', 'ai-ai-automation', 20, 'pt-BR', true),
  ('Integração de modelos de linguagem', 'llm', 'professional', 'LLMs conectados a sistemas e dados via API.', 'ai', 'ai-llm', 21, 'pt-BR', true),
  ('Git', 'git', 'projects', 'Versionamento e histórico de código.', 'tools', 'tools-git', 22, 'pt-BR', true),
  ('GitHub', 'github', 'projects', 'Repositórios, pull requests e CI com Actions.', 'tools', 'tools-github', 23, 'pt-BR', true),
  ('VS Code', 'vscode', 'projects', 'Ambiente principal de desenvolvimento.', 'tools', 'tools-vscode', 24, 'pt-BR', true),
  ('Postman', 'postman', 'projects', 'Teste e documentação de APIs.', 'tools', 'tools-postman', 25, 'pt-BR', true),
  ('Supabase', 'supabase', 'projects', 'Banco, autenticação e funções — base deste portfólio.', 'tools', 'tools-supabase', 26, 'pt-BR', true),
  ('Docker', 'docker', 'learning', 'Build em container com Nginx — usado no Finity.', 'tools', 'tools-docker', 27, 'pt-BR', true),
  ('Vitest', 'vitest', 'learning', 'Testes automatizados de componentes e regras.', 'tools', 'tools-vitest', 28, 'pt-BR', true),
  ('Frédy.app', 'fredy', 'professional', 'Ecossistema de CRM e atendimento em que atuo.', 'platforms', 'platforms-fredy', 29, 'pt-BR', true),
  ('Duda.app', 'duda', 'professional', 'Ecossistema de soluções em que atuo.', 'platforms', 'platforms-duda', 30, 'pt-BR', true),
  ('CRM', 'crm', 'professional', 'Configuração, suporte e integrações de CRM.', 'platforms', 'platforms-crm', 31, 'pt-BR', true),
  ('WhatsApp Business API', 'whatsapp', 'professional', 'Canal oficial integrado a agentes e automações.', 'platforms', 'platforms-whatsapp', 32, 'pt-BR', true),
  ('Salesforce', 'salesforce', 'learning', 'Plataforma de CRM em estudo.', 'platforms', 'platforms-salesforce', 33, 'pt-BR', true)
on conflict (id) do update set
  name = excluded.name,
  icon = excluded.icon,
  level = excluded.level,
  description = excluded.description,
  category = excluded.category,
  sort_order = excluded.sort_order,
  locale = excluded.locale,
  published = excluded.published;

insert into public.education (id, kind, title, institution, location, status, period_label, description, credential_url, topics, sort_order, locale, published)
values
  ('ads-ages', 'degree', 'Análise e Desenvolvimento de Sistemas', 'Faculdade AGES', 'Jacobina, BA', 'in_progress', 'Em andamento', 'Graduação em tecnologia que sustenta minha evolução como desenvolvedor, em paralelo à prática profissional com automações e integrações.', null, array['Desenvolvimento Web', 'Lógica de Programação', 'Engenharia de Software', 'Banco de Dados', 'UX Design']::text[], 1, 'pt-BR', true)
on conflict (id) do update set
  kind = excluded.kind,
  title = excluded.title,
  institution = excluded.institution,
  location = excluded.location,
  status = excluded.status,
  period_label = excluded.period_label,
  description = excluded.description,
  credential_url = excluded.credential_url,
  topics = excluded.topics,
  sort_order = excluded.sort_order,
  locale = excluded.locale,
  published = excluded.published;

insert into public.projects (id, slug, repo_name, title, tagline, description, challenge, solution, features, architecture, highlights, stack, screenshots, repo_url, demo_url, category, featured, is_primary, sort_order, locale, published)
values
  ('finity', 'finity', 'Finity', 'Finity', 'Gerenciador de tarefas no estilo Kanban', 'Sistema de gerenciamento de tarefas no estilo Kanban, feito com React e TypeScript, com quadro de arrastar e soltar, projetos, filtros e indicadores.', 'Construir um gerenciador de tarefas completo — quadro Kanban, projetos, filtros e indicadores — que funcione inteiramente no navegador, com a qualidade do código verificada a cada alteração.', 'Aplicação em React 19 com hooks próprios e Context API. As regras de negócio ficam em módulos TypeScript sem dependência de React, e uma camada dedicada isola a persistência em LocalStorage. Lint, checagem de tipos, testes e build rodam no GitHub Actions a cada push, com deploy automático na Vercel.', array['Criar, editar, duplicar e excluir tarefas', 'Mover tarefas entre colunas arrastando os cards', 'Busca por título ou descrição e filtros por prioridade, categoria e status', 'Filtros refletidos na URL, permitindo compartilhar uma visão já filtrada', 'Página de projetos com tarefas agrupadas e progresso de cada um', 'Indicadores de total, pendentes, em andamento e concluídas', 'Exportação e importação das tarefas em JSON', 'Atalhos de teclado, tema claro e escuro e layout responsivo']::text[], array['src/components — interface: quadro, colunas, cards, tabela, modais e sidebar', 'src/hooks — estado e comportamento: tarefas, tema, toasts e atalhos', 'js/script — regras puras: tipos, filtros, ordenação e validações, sem React', 'api.ts — camada que isola a persistência (LocalStorage)', 'Dockerfile + Nginx — build servido em container']::text[], array['Testes com Vitest para componentes, hooks e regras de negócio', 'CI no GitHub Actions: lint, tipos, testes e build a cada push', 'Deploy contínuo na Vercel a partir da branch main']::text[], array['React 19', 'TypeScript', 'React Router', 'Sass', 'Vite', 'Vitest', 'Docker', 'GitHub Actions', 'Vercel']::text[], '[{"src":"/projects/finity-1.webp","alt":"Dashboard do Finity com indicadores de tarefas e quadro Kanban com as colunas A Fazer, Em andamento e Concluído"}]'::jsonb, 'https://github.com/erickmoura012/Finity', 'https://finity-erick.vercel.app', 'web', true, true, 1, 'pt-BR', true),
  ('menuflow', 'menuflow', 'MenuFlow', 'MenuFlow', 'Cardápio digital com pedido pelo WhatsApp', 'Plataforma de cardápio digital para restaurantes, pizzarias e hamburguerias: o cliente monta o pedido e o envia pronto pelo WhatsApp, e o restaurante gerencia tudo por um painel.', 'Oferecer a restaurantes um cardápio digital com pedido organizado pelo WhatsApp e um painel simples para manter produtos, preços e disponibilidade — sem exigir instalação.', 'Aplicação em HTML, CSS e JavaScript puros, com uma camada de serviços assíncrona que isola o armazenamento. As telas nunca acessam o LocalStorage diretamente, o que deixa o caminho preparado para trocar a persistência por uma API REST sem reescrever a interface.', array['Cardápio por categoria, com busca que ignora acentos', 'Carrinho com quantidades, observações e taxa de entrega', 'Entrega ou retirada e forma de pagamento, com troco', 'Mensagem do pedido montada e enviada ao WhatsApp do restaurante', 'Painel com indicadores e gráfico de produtos por categoria', 'Cadastro de produtos, preços, disponibilidade e categorias', 'Configurações do restaurante: nome, WhatsApp, endereço e horário']::text[], array['index.html — área do cliente · admin.html — painel do restaurante', 'js/servicos — produtos, categorias e restaurante atrás de funções assíncronas', 'carrinho.js e whatsapp.js — regras do carrinho e montagem do pedido', 'Rotas REST futuras já mapeadas função a função no README']::text[], array['Sem dependências de build: abre direto no navegador', 'Camada de serviços pronta para migrar de LocalStorage para API']::text[], array['HTML', 'CSS', 'JavaScript', 'LocalStorage', 'Vercel']::text[], '[{"src":"/projects/menuflow-1.webp","alt":"Cardápio de demonstração do MenuFlow com capa do restaurante, busca e filtro por categorias"}]'::jsonb, 'https://github.com/erickmoura012/MenuFlow', 'https://menuflow-phi.vercel.app', 'web', true, false, 2, 'pt-BR', true),
  ('rze-sites', 'rze-sites', 'rze-sites', 'RZE Sites', 'Sistema de gestão para agência de sites', 'Sistema de gestão para agência de criação e manutenção de sites: clientes, projetos, hospedagens, mensalidades e fluxo financeiro em um único painel.', 'Centralizar a gestão de uma agência de sites — clientes, projetos, hospedagens, mensalidades e financeiro — em um painel com análises, calendário de vencimentos e exportação de dados.', 'Aplicação em Next.js (App Router) e TypeScript, com componentes no padrão shadcn/ui sobre Radix UI. A interface conversa apenas com uma camada de serviços, que concentra regras e auditoria e funciona como fronteira para a migração da persistência a um banco de dados.', array['Dashboard com indicadores e próximos vencimentos', 'Clientes com página individual e anexos', 'Lançamento de pagamentos e novas vendas', 'Financeiro com filtros e evolução de receita', 'Calendário de vencimentos do mês', 'Linha do tempo global de atividades', 'Exportação em planilha e PDF', 'Busca global']::text[], array['Componentes → hooks (TanStack Query) → services → persistência', 'Formulários com React Hook Form e validação com Zod', 'Tabelas com TanStack Table e gráficos com Recharts', 'Entidades do domínio já mapeadas para tabelas de banco']::text[], array['Paleta dos gráficos validada para contraste e daltonismo', 'Identidade do sistema configurável sem alterar componentes']::text[], array['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'TanStack Query', 'Recharts', 'Zod', 'Supabase']::text[], '[]'::jsonb, 'https://github.com/erickmoura012/rze-sites', null, 'web', true, false, 3, 'pt-BR', true)
on conflict (id) do update set
  slug = excluded.slug,
  repo_name = excluded.repo_name,
  title = excluded.title,
  tagline = excluded.tagline,
  description = excluded.description,
  challenge = excluded.challenge,
  solution = excluded.solution,
  features = excluded.features,
  architecture = excluded.architecture,
  highlights = excluded.highlights,
  stack = excluded.stack,
  screenshots = excluded.screenshots,
  repo_url = excluded.repo_url,
  demo_url = excluded.demo_url,
  category = excluded.category,
  featured = excluded.featured,
  is_primary = excluded.is_primary,
  sort_order = excluded.sort_order,
  locale = excluded.locale,
  published = excluded.published;

commit;
