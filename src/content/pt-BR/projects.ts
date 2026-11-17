import type { Project } from '@/types/content'

/**
 * Conteúdo editorial dos projetos em destaque.
 * Tudo aqui foi extraído dos repositórios públicos e de seus READMEs —
 * nada de métricas ou resultados que não possam ser verificados no código.
 */
export const projects: Project[] = [
  {
    id: 'finity',
    slug: 'finity',
    repoName: 'Finity',
    title: 'Finity',
    tagline: 'Gerenciador de tarefas no estilo Kanban',
    description:
      'Sistema de gerenciamento de tarefas no estilo Kanban, feito com React e TypeScript, com quadro de arrastar e soltar, projetos, filtros e indicadores.',
    challenge:
      'Construir um gerenciador de tarefas completo — quadro Kanban, projetos, filtros e indicadores — que funcione inteiramente no navegador, com a qualidade do código verificada a cada alteração.',
    solution:
      'Aplicação em React 19 com hooks próprios e Context API. As regras de negócio ficam em módulos TypeScript sem dependência de React, e uma camada dedicada isola a persistência em LocalStorage. Lint, checagem de tipos, testes e build rodam no GitHub Actions a cada push, com deploy automático na Vercel.',
    features: [
      'Criar, editar, duplicar e excluir tarefas',
      'Mover tarefas entre colunas arrastando os cards',
      'Busca por título ou descrição e filtros por prioridade, categoria e status',
      'Filtros refletidos na URL, permitindo compartilhar uma visão já filtrada',
      'Página de projetos com tarefas agrupadas e progresso de cada um',
      'Indicadores de total, pendentes, em andamento e concluídas',
      'Exportação e importação das tarefas em JSON',
      'Atalhos de teclado, tema claro e escuro e layout responsivo',
    ],
    architecture: [
      'src/components — interface: quadro, colunas, cards, tabela, modais e sidebar',
      'src/hooks — estado e comportamento: tarefas, tema, toasts e atalhos',
      'js/script — regras puras: tipos, filtros, ordenação e validações, sem React',
      'api.ts — camada que isola a persistência (LocalStorage)',
      'Dockerfile + Nginx — build servido em container',
    ],
    highlights: [
      'Testes com Vitest para componentes, hooks e regras de negócio',
      'CI no GitHub Actions: lint, tipos, testes e build a cada push',
      'Deploy contínuo na Vercel a partir da branch main',
    ],
    stack: [
      'React 19',
      'TypeScript',
      'React Router',
      'Sass',
      'Vite',
      'Vitest',
      'Docker',
      'GitHub Actions',
      'Vercel',
    ],
    screenshots: [
      {
        src: '/projects/finity-1.webp',
        alt: 'Dashboard do Finity com indicadores de tarefas e quadro Kanban com as colunas A Fazer, Em andamento e Concluído',
      },
    ],
    repoUrl: 'https://github.com/erickmoura012/Finity',
    demoUrl: 'https://finity-erick.vercel.app',
    category: 'web',
    featured: true,
    isPrimary: true,
    sortOrder: 1,
  },
  {
    id: 'menuflow',
    slug: 'menuflow',
    repoName: 'MenuFlow',
    title: 'MenuFlow',
    tagline: 'Cardápio digital com pedido pelo WhatsApp',
    description:
      'Plataforma de cardápio digital para restaurantes, pizzarias e hamburguerias: o cliente monta o pedido e o envia pronto pelo WhatsApp, e o restaurante gerencia tudo por um painel.',
    challenge:
      'Oferecer a restaurantes um cardápio digital com pedido organizado pelo WhatsApp e um painel simples para manter produtos, preços e disponibilidade — sem exigir instalação.',
    solution:
      'Aplicação em HTML, CSS e JavaScript puros, com uma camada de serviços assíncrona que isola o armazenamento. As telas nunca acessam o LocalStorage diretamente, o que deixa o caminho preparado para trocar a persistência por uma API REST sem reescrever a interface.',
    features: [
      'Cardápio por categoria, com busca que ignora acentos',
      'Carrinho com quantidades, observações e taxa de entrega',
      'Entrega ou retirada e forma de pagamento, com troco',
      'Mensagem do pedido montada e enviada ao WhatsApp do restaurante',
      'Painel com indicadores e gráfico de produtos por categoria',
      'Cadastro de produtos, preços, disponibilidade e categorias',
      'Configurações do restaurante: nome, WhatsApp, endereço e horário',
    ],
    architecture: [
      'index.html — área do cliente · admin.html — painel do restaurante',
      'js/servicos — produtos, categorias e restaurante atrás de funções assíncronas',
      'carrinho.js e whatsapp.js — regras do carrinho e montagem do pedido',
      'Rotas REST futuras já mapeadas função a função no README',
    ],
    highlights: [
      'Sem dependências de build: abre direto no navegador',
      'Camada de serviços pronta para migrar de LocalStorage para API',
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'LocalStorage', 'Vercel'],
    screenshots: [
      {
        src: '/projects/menuflow-1.webp',
        alt: 'Cardápio de demonstração do MenuFlow com capa do restaurante, busca e filtro por categorias',
      },
    ],
    repoUrl: 'https://github.com/erickmoura012/MenuFlow',
    demoUrl: 'https://menuflow-phi.vercel.app',
    category: 'web',
    featured: true,
    isPrimary: false,
    sortOrder: 2,
  },
  {
    id: 'rze-sites',
    slug: 'rze-sites',
    repoName: 'rze-sites',
    title: 'RZE Sites',
    tagline: 'Sistema de gestão para agência de sites',
    description:
      'Sistema de gestão para agência de criação e manutenção de sites: clientes, projetos, hospedagens, mensalidades e fluxo financeiro em um único painel.',
    challenge:
      'Centralizar a gestão de uma agência de sites — clientes, projetos, hospedagens, mensalidades e financeiro — em um painel com análises, calendário de vencimentos e exportação de dados.',
    solution:
      'Aplicação em Next.js (App Router) e TypeScript, com componentes no padrão shadcn/ui sobre Radix UI. A interface conversa apenas com uma camada de serviços, que concentra regras e auditoria e funciona como fronteira para a migração da persistência a um banco de dados.',
    features: [
      'Dashboard com indicadores e próximos vencimentos',
      'Clientes com página individual e anexos',
      'Lançamento de pagamentos e novas vendas',
      'Financeiro com filtros e evolução de receita',
      'Calendário de vencimentos do mês',
      'Linha do tempo global de atividades',
      'Exportação em planilha e PDF',
      'Busca global',
    ],
    architecture: [
      'Componentes → hooks (TanStack Query) → services → persistência',
      'Formulários com React Hook Form e validação com Zod',
      'Tabelas com TanStack Table e gráficos com Recharts',
      'Entidades do domínio já mapeadas para tabelas de banco',
    ],
    highlights: [
      'Paleta dos gráficos validada para contraste e daltonismo',
      'Identidade do sistema configurável sem alterar componentes',
    ],
    stack: [
      'Next.js 14',
      'TypeScript',
      'Tailwind CSS',
      'Radix UI',
      'TanStack Query',
      'Recharts',
      'Zod',
      'Supabase',
    ],
    screenshots: [],
    repoUrl: 'https://github.com/erickmoura012/rze-sites',
    demoUrl: null,
    category: 'web',
    featured: true,
    isPrimary: false,
    sortOrder: 3,
  },
]
