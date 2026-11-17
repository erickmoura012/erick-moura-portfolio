/**
 * Textos de interface em português (Brasil).
 * Para adicionar inglês: crie `en.ts` exportando um objeto do tipo `Messages`
 * e registre-o em `src/i18n/index.ts`.
 */
export const ptBR = {
  meta: {
    title: 'Erick Moura | Desenvolvedor Full Stack & Automações com IA',
    description:
      'Conheça o portfólio de Erick Moura, desenvolvedor Full Stack e Analista de Soluções com experiência em desenvolvimento web, automações, integrações de APIs e Inteligência Artificial.',
    projectTitle: (project: string) => `${project} — Projeto | Erick Moura`,
    notFoundTitle: 'Página não encontrada | Erick Moura',
  },

  common: {
    skipToContent: 'Pular para o conteúdo',
    newTab: '(abre em nova aba)',
    close: 'Fechar',
    loading: 'Carregando…',
    code: 'Código',
    demo: 'Demonstração',
    backToTop: 'Voltar ao topo',
    errorTitle: 'Algo saiu do esperado',
    errorDescription:
      'Ocorreu um erro ao exibir esta parte da página. Recarregue para tentar novamente.',
    reload: 'Recarregar página',
  },

  nav: {
    label: 'Navegação principal',
    items: {
      home: 'Início',
      about: 'Sobre',
      experience: 'Experiência',
      skills: 'Skills',
      projects: 'Projetos',
      github: 'GitHub',
      contact: 'Contato',
    },
    cta: 'Vamos conversar',
    homeLinkSuffix: 'página inicial',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    menuTitle: 'Menu',
    menuDescription: 'Navegue pelas seções do portfólio.',
    search: 'Buscar e navegar',
    toggleTheme: 'Alternar entre tema claro e escuro',
  },

  sectionIndex: {
    label: 'Atalhos para as seções',
    title: 'Índice',
    description: 'Vá direto ao que interessa.',
    items: {
      about: { label: 'Sobre', hint: 'Quem eu sou e como trabalho' },
      experience: { label: 'Experiência', hint: 'Trajetória profissional' },
      skills: { label: 'Skills', hint: 'Tecnologias por contexto de uso' },
      solutions: { label: 'Soluções', hint: 'Automações, IA e integrações' },
      projects: { label: 'Projetos', hint: 'Estudos de caso e repositórios' },
      github: { label: 'GitHub', hint: 'Atividade e linguagens' },
      education: { label: 'Formação', hint: 'Base acadêmica' },
      contact: { label: 'Contato', hint: 'Vamos conversar' },
    },
  },

  hero: {
    metaLeft: 'Portfólio profissional',
    metaRight: 'Full Stack · Automações · IA',
    photoAlt:
      'Erick Moura de óculos e headphone, concentrado diante do computador em um ambiente com iluminação azul',
    photoTag: 'Fig. 01',
    photoCaption: 'Erick Moura',
    photoCaptionRight: 'Analista de Soluções',
    greeting: 'Olá, eu sou',
    rolesLabel: 'Atuação:',
    ctaProjects: 'Explorar projetos',
    ctaContact: 'Entrar em contato',
    ctaResume: 'Baixar currículo',
    statusLabel: 'Atualmente',
    status: 'Analista de Soluções na Teté à Teté',
    socialLabel: 'Redes e contato',
    github: 'GitHub de Erick Moura',
    linkedin: 'LinkedIn de Erick Moura',
    email: 'Enviar e-mail para Erick Moura',
  },

  about: {
    eyebrow: 'sobre',
    title: 'Tecnologia aplicada a problemas reais',
    titleHighlight: 'problemas reais',
    highlightsTitle: 'Onde eu atuo',
    factsTitle: 'Ficha',
    facts: {
      name: 'Nome',
      role: 'Atuação',
      education: 'Formação',
      focus: 'Foco',
      focusValue: 'Web, automações e Inteligência Artificial',
      projects: 'Projetos',
    },
    highlights: [
      {
        id: 'fullstack',
        title: 'Desenvolvimento Full Stack',
        description:
          'Aplicações web com React e TypeScript, do layout responsivo à organização do código.',
      },
      {
        id: 'automation',
        title: 'Automação de Processos',
        description:
          'Workflows no n8n que eliminam tarefas manuais em rotinas comerciais e operacionais.',
      },
      {
        id: 'ai',
        title: 'Inteligência Artificial',
        description: 'Agentes conversacionais e modelos de linguagem integrados ao atendimento.',
      },
      {
        id: 'integration',
        title: 'Integração de Sistemas',
        description: 'APIs REST, webhooks e CRMs conversando entre si, com controle de estado.',
      },
    ],
    timelineTitle: 'Linha do tempo',
    timeline: [
      {
        period: '2019',
        title: 'Gestão administrativa',
        description: 'Início como Gerente Administrativo no Restaurante Sabor Baiano.',
      },
      {
        period: 'Em andamento',
        title: 'Análise e Desenvolvimento de Sistemas',
        description: 'Graduação na Faculdade AGES.',
      },
      {
        period: 'Jul 2026',
        title: 'Analista de Soluções',
        description:
          'Entrada na Teté à Teté Marketing de Conversa, com automações, integrações e IA.',
      },
      {
        period: '2026',
        title: 'Projetos públicos no GitHub',
        description: 'Publicação de aplicações como RZE Sites, MenuFlow e Finity.',
      },
    ],
  },

  experience: {
    eyebrow: 'experiência',
    title: 'Trajetória profissional',
    titleHighlight: 'profissional',
    description:
      'Da gestão de operações à construção de soluções: o fio condutor é resolver problemas reais.',
    current: 'Atual',
    activitiesLabel: 'Principais atividades',
    showMore: (count: number) => `Ver mais ${count} atividades`,
    showLess: 'Mostrar menos',
    tagsLabel: 'Tecnologias e competências',
  },

  skills: {
    eyebrow: 'skills',
    title: 'Tecnologias e ferramentas',
    titleHighlight: 'ferramentas',
    description: 'Organizadas pelo contexto real de uso — sem barras de porcentagem arbitrárias.',
    filterLabel: 'Filtrar tecnologias',
    legendLabel: 'Legenda dos níveis',
    all: 'Todas',
    learningFilter: 'Em aprendizado',
    categories: {
      frontend: 'Frontend',
      backend: 'Backend e Integrações',
      ai: 'Inteligência Artificial',
      tools: 'Ferramentas',
      platforms: 'Plataformas',
    },
    levels: {
      professional: 'Uso profissional',
      projects: 'Uso em projetos',
      learning: 'Em aprendizado',
    },
    count: (count: number) => (count === 1 ? '1 tecnologia' : `${count} tecnologias`),
  },

  solutions: {
    eyebrow: 'soluções',
    title: 'Soluções que desenvolvo',
    titleHighlight: 'desenvolvo',
    description:
      'Minha atuação vai além da interface: conecto sistemas, automatizo processos e coloco a IA para trabalhar dentro da operação.',
    tabsLabel: 'Áreas de solução',
    flowLabel: 'Arquitetura de referência',
    themesLabel: 'Frentes de atuação',
    capabilitiesLabel: 'O que entrego',
    confidentiality:
      'As arquiteturas são apresentadas de forma genérica. Nomes de clientes, credenciais e detalhes internos são confidenciais e não são publicados.',
    areas: {
      web: {
        title: 'Desenvolvimento Web',
        description:
          'Aplicações e interfaces web responsivas, com atenção à organização do código, à usabilidade e ao desempenho.',
        capabilities: [
          'Interfaces em React e TypeScript',
          'Layouts responsivos e acessíveis',
          'Camadas de serviço que isolam dados da interface',
        ],
        flow: ['Interface React', 'Camada de serviços', 'API ou banco de dados'],
        themes: ['Aplicações web completas', 'Painéis administrativos'],
      },
      automation: {
        title: 'Automações',
        description:
          'Workflows que eliminam tarefas repetitivas em processos comerciais, operacionais e financeiros.',
        capabilities: [
          'Workflows no n8n, do gatilho à entrega',
          'Regras de negócio e tratamento de erros nos fluxos',
          'Documentação e treinamento de quem usa',
        ],
        flow: [
          'Gatilho (webhook ou agenda)',
          'Workflow no n8n',
          'Regras e validações',
          'CRM e canais',
        ],
        themes: ['Automações comerciais com n8n', 'Automações operacionais e financeiras'],
      },
      ai: {
        title: 'Inteligência Artificial',
        description:
          'Agentes conversacionais que atendem, qualificam e encaminham, integrados aos sistemas do negócio.',
        capabilities: [
          'Configuração de agentes de IA para atendimento',
          'Engenharia de prompt e contexto',
          'Modelos de linguagem conectados a dados via API',
        ],
        flow: [
          'Mensagem no WhatsApp',
          'Agente de IA',
          'Consulta a sistemas via API',
          'Resposta ou transferência',
        ],
        themes: ['Agentes conversacionais com IA'],
      },
      integration: {
        title: 'Integração de Sistemas',
        description:
          'Conexão entre APIs REST, CRMs e serviços de terceiros, com controle de estado e distribuição.',
        capabilities: [
          'Integração de APIs REST e webhooks',
          'Redis para estado e distribuição de fluxos',
          'Conexão com serviços financeiros e de telefonia',
        ],
        flow: [
          'Sistema de origem',
          'API REST ou webhook',
          'Orquestração + Redis',
          'CRM de destino',
        ],
        themes: ['Integrações entre APIs e CRM', 'Sistemas de distribuição de atendimento'],
      },
    },
  },

  projects: {
    eyebrow: 'projetos',
    title: 'Projetos em destaque',
    titleHighlight: 'em destaque',
    description:
      'Projetos autorais com código aberto e produtos em que colaborei, com o contexto do desafio e das decisões de cada um.',
    primaryLabel: 'Projeto principal',
    ownLabel: 'Autoral',
    caseStudy: 'Ver estudo do projeto',
    caseStudyOf: (project: string) => `Ver estudo do projeto ${project}`,
    codeOf: (project: string) => `Código de ${project} no GitHub`,
    demoOf: (project: string) => `Demonstração de ${project}`,
    screenshotAlt: (project: string) => `Tela do projeto ${project}`,
    explorerTitle: 'Todos os repositórios',
    explorerDescription: 'Lista obtida da API oficial do GitHub.',
    searchLabel: 'Buscar repositório',
    searchPlaceholder: 'Buscar por nome ou descrição…',
    languageLabel: 'Linguagem',
    allLanguages: 'Todas as linguagens',
    sortLabel: 'Ordenar por',
    sort: {
      updated: 'Atualização mais recente',
      stars: 'Mais estrelas',
      name: 'Nome (A–Z)',
    },
    resultCount: (count: number) =>
      count === 1 ? '1 repositório encontrado' : `${count} repositórios encontrados`,
    empty: 'Nenhum repositório corresponde a esses filtros.',
    clearFilters: 'Limpar filtros',
    viewProfile: 'Ver perfil completo no GitHub',
    archived: 'Arquivado',
    fork: 'Fork',
    featuredBadge: 'Destaque',
    noDescription: 'Sem descrição no repositório.',
    stars: (count: number) => (count === 1 ? '1 estrela' : `${count} estrelas`),
    forks: (count: number) => (count === 1 ? '1 fork' : `${count} forks`),
    updatedOn: (date: string) => `Atualizado em ${date}`,
    page: {
      back: 'Voltar aos projetos',
      challenge: 'Desafio',
      solution: 'Solução',
      features: 'Funcionalidades',
      architecture: 'Arquitetura',
      highlights: 'Destaques técnicos',
      stack: 'Tecnologias',
      screenshots: 'Telas',
      repository: 'Repositório',
      notFoundTitle: 'Projeto não encontrado',
      notFoundDescription: 'Este projeto não existe ou não está mais em destaque.',
    },
  },

  github: {
    eyebrow: 'github',
    title: 'Atividade no GitHub',
    titleHighlight: 'GitHub',
    description: 'Dados públicos obtidos da API oficial do GitHub — nada aqui é simulado.',
    stats: {
      repos: 'Repositórios públicos',
      events: 'Eventos públicos recentes',
      followers: 'Seguidores',
      languages: 'Linguagens nos projetos',
    },
    languagesTitle: 'Linguagens nos repositórios',
    languagesHint: 'Proporção por volume de código, segundo o GitHub.',
    otherLanguages: 'Outras',
    languagesEmpty: 'O GitHub ainda não informou as linguagens destes repositórios.',
    activityTitle: 'Atividade pública recente',
    activitySummary: (total: number, from: string, to: string) =>
      `${total} eventos públicos entre ${from} e ${to}`,
    /** Texto que acompanha o número no tooltip (o valor é exibido em destaque, à parte). */
    activityDayLabel: (count: number, date: string) =>
      count === 1 ? `evento em ${date}` : `eventos em ${date}`,
    activityKeyboardHint: 'Use as setas esquerda e direita para percorrer os dias.',
    tableDate: 'Data',
    tableEvents: 'Eventos',
    activityEmpty: 'Sem eventos públicos recentes informados pelo GitHub.',
    activityTypes: {
      PushEvent: 'Pushes',
      PullRequestEvent: 'Pull requests',
      CreateEvent: 'Branches e repositórios criados',
      DeleteEvent: 'Branches removidas',
      IssuesEvent: 'Issues',
      WatchEvent: 'Estrelas dadas',
      ForkEvent: 'Forks',
      ReleaseEvent: 'Releases',
    } as Record<string, string>,
    contributionsTitle: 'Contribuições no último ano',
    contributionsTotal: (total: number) =>
      total === 1 ? '1 contribuição no último ano' : `${total} contribuições no último ano`,
    contributionsTotalLabel: (total: number) =>
      total === 1 ? 'contribuição no último ano' : 'contribuições no último ano',
    contributionsDayLabel: (count: number, date: string) =>
      count === 1 ? `contribuição em ${date}` : `contribuições em ${date}`,
    contributionsUnavailable:
      'O calendário de contribuições depende da sincronização autenticada no servidor, que ainda não foi ativada. Enquanto isso, ele pode ser visto direto no perfil.',
    contributionsCta: 'Ver contribuições no GitHub',
    less: 'Menos',
    more: 'Mais',
    memberSince: (date: string) => `No GitHub desde ${date}`,
    profileAlt: (name: string) => `Foto de perfil de ${name} no GitHub`,
    recentTitle: 'Repositórios atualizados recentemente',
    followCommits: 'Acompanhar meus commits',
    syncedAt: (date: string) => `Sincronizado em ${date}`,
    refreshing: 'Atualizando dados…',
    notices: {
      'rate-limited':
        'A API do GitHub atingiu o limite de requisições. Exibindo os últimos dados sincronizados.',
      offline:
        'Não foi possível falar com o GitHub agora. Exibindo os últimos dados sincronizados.',
    },
    errorTitle: 'Não foi possível carregar os dados do GitHub',
    errorDescription: 'Tente novamente em instantes ou acesse o perfil diretamente.',
    retry: 'Tentar novamente',
  },

  education: {
    eyebrow: 'formação',
    title: 'Formação',
    titleHighlight: 'Formação',
    description: 'Base acadêmica em paralelo à prática profissional.',
    kinds: {
      degree: 'Graduação',
      course: 'Curso',
      certification: 'Certificação',
    },
    statuses: {
      in_progress: 'Em andamento',
      completed: 'Concluído',
    },
    topicsLabel: 'Áreas de estudo',
    credential: 'Ver credencial',
    coursesTitle: 'Cursos e certificações',
  },

  contact: {
    eyebrow: 'contato',
    title: 'Vamos construir algo incrível juntos?',
    titleHighlight: 'algo incrível',
    description:
      'Está desenvolvendo um projeto, buscando um profissional de tecnologia ou precisa automatizar algum processo? Vamos conversar.',
    fields: {
      name: 'Nome',
      email: 'E-mail',
      subject: 'Assunto',
      message: 'Mensagem',
    },
    placeholders: {
      name: 'Como posso te chamar?',
      email: 'voce@exemplo.com',
      subject: 'Sobre o que vamos conversar?',
      message: 'Conte um pouco sobre o projeto, a vaga ou o processo que quer automatizar.',
    },
    honeypotLabel: 'Não preencha este campo',
    submit: 'Enviar mensagem',
    sending: 'Enviando…',
    privacy: 'Seus dados são usados apenas para responder a esta mensagem.',
    successTitle: 'Mensagem enviada!',
    successDescription: 'Obrigado pelo contato. Respondo assim que possível.',
    sendAnother: 'Enviar outra mensagem',
    errors: {
      generic:
        'Não foi possível enviar sua mensagem agora. Tente novamente em instantes ou fale comigo pelo LinkedIn.',
      rateLimited:
        'Você enviou várias mensagens em pouco tempo. Aguarde alguns minutos e tente de novo.',
      validation: 'Revise os campos destacados e tente novamente.',
    },
    unavailableTitle: 'Formulário em configuração',
    unavailableDescription:
      'O envio de mensagens por aqui ainda está sendo ativado. Enquanto isso, fale comigo pelo LinkedIn.',
    channelsTitle: 'Outros canais',
    channels: {
      linkedin: 'LinkedIn',
      linkedinHint: 'Conexões e mensagens profissionais',
      github: 'GitHub',
      githubHint: 'Código, projetos e contribuições',
      email: 'E-mail',
    },
  },

  footer: {
    tagline: 'Desenvolvimento web, automações e Inteligência Artificial.',
    builtWith: 'Construído com React, TypeScript, Tailwind CSS e Supabase.',
    rights: (year: number) => `© ${year} Erick Moura. Todos os direitos reservados.`,
    navTitle: 'Navegação',
    socialTitle: 'Redes',
    openTerminal: 'Modo terminal',
    sourceCode: 'Código-fonte deste site',
  },

  commandPalette: {
    title: 'Paleta de comandos',
    description: 'Busque seções, projetos e ações.',
    placeholder: 'Buscar seções, projetos e ações…',
    empty: 'Nada encontrado.',
    groups: {
      navigation: 'Navegação',
      projects: 'Projetos',
      actions: 'Ações',
      links: 'Links',
    },
    actions: {
      toggleTheme: 'Alternar tema',
      openTerminal: 'Abrir modo terminal',
      openGithub: 'Abrir GitHub',
      openLinkedin: 'Abrir LinkedIn',
      contact: 'Entrar em contato',
    },
    hintNavigate: 'navegar',
    hintSelect: 'selecionar',
    hintClose: 'fechar',
  },

  terminal: {
    title: 'Modo terminal',
    description: 'Terminal interativo com comandos sobre o portfólio.',
    prompt: 'visitante@erickmoura:~$',
    inputLabel: 'Comando do terminal',
    welcome: [
      'Portfólio de Erick Moura — modo terminal',
      'Digite "help" para ver os comandos disponíveis.',
    ],
    help: {
      help: 'lista os comandos disponíveis',
      about: 'quem é Erick Moura',
      skills: 'tecnologias por categoria',
      projects: 'projetos em destaque',
      github: 'resumo do GitHub',
      contact: 'canais de contato',
      clear: 'limpa a tela',
    },
    helpTitle: 'Comandos disponíveis:',
    notFound: (command: string) =>
      `comando não encontrado: ${command}. Digite "help" para ver as opções.`,
    githubSummary: (repos: number, followers: number) =>
      `${repos} repositórios públicos · ${followers} seguidores`,
    contactHint: 'Formulário: seção "Contato" desta página.',
  },

  notFound: {
    code: '404',
    title: 'Rota não encontrada',
    description: 'O endereço que você tentou acessar não existe ou foi movido.',
    home: 'Voltar ao início',
    projects: 'Ver projetos',
    logCommand: 'resolve',
    logError: (path: string) => `Erro: nenhuma rota corresponde a "${path}"`,
    logHint: 'Dica: volte ao início ou use Ctrl+K para navegar.',
  },
}

export type Messages = typeof ptBR
