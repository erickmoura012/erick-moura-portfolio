import type { Project } from '@/types/content'

/**
 * Conteúdo editorial dos projetos em destaque.
 * Projetos autorais: extraídos dos repositórios públicos e de seus READMEs.
 * Colaborações: descritas apenas com o que o produto publicado mostra.
 * Nada de métricas ou resultados que não possam ser verificados.
 */
export const projects: Project[] = [
  {
    id: 'finity',
    slug: 'finity',
    repoName: 'Finity',
    title: 'Finity',
    role: null,
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
    id: 'clicouai',
    slug: 'clicouai',
    repoName: null,
    title: 'ClicouAí',
    role: 'Colaborador',
    tagline: 'Plataforma de venda de fotos de eventos',
    description:
      'Plataforma de venda de fotos de eventos em que atuei no front-end e no back-end: o participante encontra as próprias fotos enviando uma selfie, com reconhecimento facial da AWS Rekognition, e o fotógrafo publica e vende pelo painel.',
    challenge:
      'Fazer as milhares de fotos de cada evento chegarem às pessoas certas, com uma compra simples e segura para quem participou e uma forma de publicar e vender que valha a pena para os fotógrafos.',
    solution:
      'Aplicação web em produção, construída com Next.js. Como colaborador, atuei no front-end e no back-end e desenvolvi a busca de fotos por selfie, que usa o reconhecimento facial da AWS Rekognition para localizar a pessoa entre as fotos do evento, além do painel de uso, da tela de fotógrafos, da tela de upload de fotos e do canal de suporte.',
    features: [
      'Busca de fotos por selfie com reconhecimento facial (AWS Rekognition)',
      'Painel de uso',
      'Tela de fotógrafos',
      'Upload de fotos dos eventos',
      'Canal de suporte',
      'Busca de eventos por nome, data ou local',
      'Pagamento com Pix ou cartão e download imediato do arquivo original',
    ],
    architecture: [
      'Selfie do participante → reconhecimento facial (AWS Rekognition) → fotos encontradas no evento',
      'Fotógrafo → upload das fotos → evento publicado para venda',
    ],
    highlights: [
      'Busca de fotos por selfie com reconhecimento facial da AWS Rekognition',
      'Painel de uso, tela de fotógrafos e tela de upload de fotos',
      'Canal de suporte da plataforma',
      'Atuação no front-end e no back-end de um produto em produção',
    ],
    stack: ['Next.js', 'React', 'AWS Rekognition'],
    screenshots: [
      {
        src: '/projects/clicouai-1.webp',
        alt: 'Página inicial do ClicouAí com busca de eventos e fotos de corridas, festas e esportes',
      },
    ],
    repoUrl: null,
    demoUrl: 'https://www.clicouai.com',
    category: 'web',
    featured: true,
    isPrimary: false,
    sortOrder: 2,
  },
  {
    id: 'menuflow',
    slug: 'menuflow',
    repoName: 'MenuFlow',
    title: 'MenuFlow',
    role: null,
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
    sortOrder: 3,
  },
  {
    id: 'rze-sites',
    slug: 'rze-sites',
    repoName: 'rze-sites',
    title: 'RZE Sites',
    role: null,
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
    sortOrder: 4,
  },
]
