import type { EducationItem } from '@/types/content'

/**
 * Cursos e certificações só entram aqui (ou pelo painel) depois de confirmados.
 */
export const education: EducationItem[] = [
  {
    id: 'ads-ages',
    kind: 'degree',
    title: 'Análise e Desenvolvimento de Sistemas',
    institution: 'Faculdade AGES',
    location: 'Jacobina, BA',
    status: 'in_progress',
    periodLabel: 'Em andamento',
    description:
      'Graduação em tecnologia que sustenta minha evolução como desenvolvedor, em paralelo à prática profissional com automações e integrações.',
    credentialUrl: null,
    topics: [
      'Desenvolvimento Web',
      'Lógica de Programação',
      'Engenharia de Software',
      'Banco de Dados',
      'UX Design',
    ],
    sortOrder: 1,
  },
]
