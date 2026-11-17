import type { Experience } from '@/types/content'

export const experiences: Experience[] = [
  {
    id: 'tete-a-tete',
    company: 'Teté à Teté Marketing de Conversa',
    role: 'Analista de Soluções',
    location: 'Remoto',
    periodLabel: 'Jul 2026 — Atual',
    isCurrent: true,
    summary:
      'Desenvolvo e mantenho soluções tecnológicas integradas aos ecossistemas Frédy.app e Duda.app, do levantamento da demanda à implantação com o cliente.',
    activities: [
      'Desenvolvimento e manutenção de workflows no n8n.',
      'Integração de APIs REST com plataformas de CRM.',
      'Configuração de agentes conversacionais com Inteligência Artificial.',
      'Integração com a WhatsApp Business API.',
      'Automação de processos comerciais e operacionais.',
      'Uso de Redis em fluxos de distribuição e controle de estados.',
      'Integração de serviços financeiros e de telefonia.',
      'Suporte técnico e atendimento a clientes via chat.',
      'Levantamento e documentação de demandas.',
      'Treinamento de usuários e implantação de soluções.',
      'Manutenção de sistemas e melhoria contínua de processos.',
    ],
    tags: ['n8n', 'APIs REST', 'Redis', 'OpenAI', 'WhatsApp API', 'CRM', 'Webhooks', 'JSON'],
    sortOrder: 1,
  },
  {
    id: 'sabor-baiano',
    company: 'Restaurante Sabor Baiano',
    role: 'Gerente Administrativo',
    location: null,
    periodLabel: '2019 — 2026',
    isCurrent: false,
    summary:
      'Anos à frente da operação de um restaurante formaram a base que hoje aplico em tecnologia: enxergar processos de ponta a ponta, priorizar demandas e resolver problemas com o cliente no centro.',
    activities: [
      'Gestão da operação diária, com foco em organização e eficiência dos processos.',
      'Atendimento ao público e comunicação direta com clientes.',
      'Resolução de problemas e tomada de decisão em situações de pressão.',
      'Gestão de demandas e coordenação de equipes.',
      'Organização e melhoria de processos administrativos.',
    ],
    tags: [
      'Gestão de processos',
      'Atendimento ao cliente',
      'Resolução de problemas',
      'Gestão de equipes',
      'Comunicação',
    ],
    sortOrder: 2,
  },
]
