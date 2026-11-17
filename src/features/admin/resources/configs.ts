import { TECH_ICON_KEYS } from '@/components/common/tech-icons'
import {
  EDUCATION_KINDS,
  EDUCATION_STATUSES,
  SKILL_CATEGORIES,
  SKILL_LEVELS,
  SOLUTION_CATEGORIES,
} from '@/types/content'
import { ProjectPreview } from './ProjectPreview'
import type { FieldConfig, FieldOption, ResourceConfig, ResourceRow } from './types'

const text = (row: ResourceRow, key: string): string => {
  const value = row[key]
  return typeof value === 'string' ? value : ''
}

const options = <T extends string>(
  values: readonly T[],
  labels: Record<T, string>,
): FieldOption[] => values.map((value) => ({ value, label: labels[value] }))

const SKILL_CATEGORY_LABELS = {
  frontend: 'Frontend',
  backend: 'Backend e Integrações',
  ai: 'Inteligência Artificial',
  tools: 'Ferramentas',
  platforms: 'Plataformas',
}
const SKILL_LEVEL_LABELS = {
  professional: 'Uso profissional',
  projects: 'Projetos próprios',
  learning: 'Em aprendizado',
}
const EDUCATION_KIND_LABELS = {
  degree: 'Graduação',
  course: 'Curso',
  certification: 'Certificação',
}
const EDUCATION_STATUS_LABELS = { in_progress: 'Em andamento', completed: 'Concluído' }
const SOLUTION_CATEGORY_LABELS = {
  web: 'Desenvolvimento Web',
  automation: 'Automações',
  ai: 'Inteligência Artificial',
  integration: 'Integração de Sistemas',
}

export const projectsConfig: ResourceConfig = {
  table: 'projects',
  title: 'Projetos',
  description: 'Conteúdo editorial dos projetos — complementa os dados vindos do GitHub.',
  singular: 'projeto',
  gender: 'm',
  rowTitle: (row) => text(row, 'title'),
  rowSubtitle: (row) => text(row, 'tagline'),
  badges: (row) => (row.isPrimary === true ? [{ label: 'Principal', variant: 'cyan' }] : []),
  toggles: [{ field: 'featured', label: 'Destaque' }],
  Preview: ProjectPreview,
  fields: [
    { name: 'title', label: 'Título', type: 'text', required: true, maxLength: 120 },
    {
      name: 'slug',
      label: 'Slug (endereço da página)',
      type: 'text',
      required: true,
      maxLength: 80,
      hint: 'Letras minúsculas, números e hífens. Ex.: meu-projeto',
      pattern: {
        regex: /^[a-z0-9]+(-[a-z0-9]+)*$/,
        message: 'Use apenas letras minúsculas, números e hífens.',
      },
    },
    { name: 'tagline', label: 'Resumo em uma linha', type: 'text', required: true, wide: true },
    {
      name: 'description',
      label: 'Descrição',
      type: 'textarea',
      required: true,
      maxLength: 600,
    },
    {
      name: 'category',
      label: 'Categoria',
      type: 'select',
      options: options(SOLUTION_CATEGORIES, SOLUTION_CATEGORY_LABELS),
    },
    {
      name: 'repoName',
      label: 'Repositório no GitHub',
      type: 'text',
      maxLength: 100,
      hint: 'Nome exato do repositório, para cruzar com os dados da API.',
    },
    { name: 'repoUrl', label: 'URL do código', type: 'url' },
    { name: 'demoUrl', label: 'URL da demonstração', type: 'url' },
    { name: 'challenge', label: 'Desafio', type: 'textarea' },
    { name: 'solution', label: 'Solução', type: 'textarea' },
    { name: 'features', label: 'Funcionalidades', type: 'list' },
    { name: 'architecture', label: 'Arquitetura', type: 'list' },
    { name: 'highlights', label: 'Destaques técnicos', type: 'list' },
    { name: 'stack', label: 'Tecnologias', type: 'list' },
    { name: 'screenshots', label: 'Imagens do projeto', type: 'screenshots' },
    {
      name: 'featured',
      label: 'Em destaque',
      type: 'boolean',
      hint: 'Aparece em “Projetos em destaque” e ganha página de estudo.',
      defaultValue: true,
    },
    {
      name: 'isPrimary',
      label: 'Projeto principal',
      type: 'boolean',
      hint: 'Só um por vez: marcar este desmarca o anterior.',
    },
  ],
}

export const skillsConfig: ResourceConfig = {
  table: 'skills',
  title: 'Skills',
  description: 'Tecnologias exibidas na seção de skills, com categoria e contexto de uso.',
  singular: 'skill',
  gender: 'f',
  rowTitle: (row) => text(row, 'name'),
  rowSubtitle: (row) => text(row, 'description'),
  badges: (row) => {
    const category = text(row, 'category') as keyof typeof SKILL_CATEGORY_LABELS
    const level = text(row, 'level') as keyof typeof SKILL_LEVEL_LABELS
    return [
      { label: SKILL_CATEGORY_LABELS[category] ?? category },
      { label: SKILL_LEVEL_LABELS[level] ?? level, variant: 'accent' },
    ]
  },
  fields: [
    { name: 'name', label: 'Nome', type: 'text', required: true, maxLength: 80 },
    {
      name: 'icon',
      label: 'Ícone',
      type: 'select',
      options: TECH_ICON_KEYS.map((key) => ({ value: key, label: key })),
      hint: 'Ícones disponíveis no registro do site.',
    },
    {
      name: 'category',
      label: 'Categoria',
      type: 'select',
      options: options(SKILL_CATEGORIES, SKILL_CATEGORY_LABELS),
    },
    {
      name: 'level',
      label: 'Contexto de uso',
      type: 'select',
      options: options(SKILL_LEVELS, SKILL_LEVEL_LABELS),
      hint: 'Classifique com honestidade: não há níveis como “avançado”.',
    },
    {
      name: 'description',
      label: 'Descrição curta',
      type: 'text',
      required: true,
      maxLength: 120,
      wide: true,
    },
  ],
}

export const experiencesConfig: ResourceConfig = {
  table: 'experiences',
  title: 'Experiências',
  description: 'Linha do tempo profissional exibida na seção de experiência.',
  singular: 'experiência',
  gender: 'f',
  rowTitle: (row) => text(row, 'role'),
  rowSubtitle: (row) => `${text(row, 'company')} · ${text(row, 'periodLabel')}`,
  badges: (row) => (row.isCurrent === true ? [{ label: 'Atual', variant: 'cyan' }] : []),
  fields: [
    { name: 'role', label: 'Cargo', type: 'text', required: true, maxLength: 160 },
    { name: 'company', label: 'Empresa', type: 'text', required: true, maxLength: 160 },
    {
      name: 'periodLabel',
      label: 'Período',
      type: 'text',
      required: true,
      maxLength: 80,
      placeholder: 'Jul 2026 — Atual',
    },
    { name: 'location', label: 'Local', type: 'text', maxLength: 120, placeholder: 'Remoto' },
    { name: 'summary', label: 'Resumo', type: 'textarea', required: true, maxLength: 600 },
    { name: 'activities', label: 'Atividades', type: 'list', rows: 8 },
    { name: 'tags', label: 'Tecnologias e competências', type: 'list' },
    { name: 'isCurrent', label: 'Cargo atual', type: 'boolean' },
  ],
}

export const educationConfig: ResourceConfig = {
  table: 'education',
  title: 'Formação',
  description: 'Graduação, cursos e certificações. Inclua apenas o que puder ser comprovado.',
  singular: 'formação',
  gender: 'f',
  rowTitle: (row) => text(row, 'title'),
  rowSubtitle: (row) => text(row, 'institution'),
  badges: (row) => {
    const kind = text(row, 'kind') as keyof typeof EDUCATION_KIND_LABELS
    const status = text(row, 'status') as keyof typeof EDUCATION_STATUS_LABELS
    return [
      { label: EDUCATION_KIND_LABELS[kind] ?? kind },
      {
        label: EDUCATION_STATUS_LABELS[status] ?? status,
        variant: status === 'completed' ? 'success' : 'accent',
      },
    ]
  },
  fields: [
    { name: 'title', label: 'Título', type: 'text', required: true, maxLength: 200 },
    { name: 'institution', label: 'Instituição', type: 'text', required: true, maxLength: 200 },
    {
      name: 'kind',
      label: 'Tipo',
      type: 'select',
      options: options(EDUCATION_KINDS, EDUCATION_KIND_LABELS),
    },
    {
      name: 'status',
      label: 'Situação',
      type: 'select',
      options: options(EDUCATION_STATUSES, EDUCATION_STATUS_LABELS),
    },
    { name: 'periodLabel', label: 'Período', type: 'text', maxLength: 80 },
    { name: 'location', label: 'Local', type: 'text', maxLength: 120 },
    { name: 'description', label: 'Descrição', type: 'textarea', maxLength: 600 },
    { name: 'credentialUrl', label: 'URL da credencial', type: 'url', wide: true },
    { name: 'topics', label: 'Áreas de estudo', type: 'list' },
  ],
}

/** Campos do perfil (linha única por idioma em `profile_settings`). */
export const profileFields: FieldConfig[] = [
  { name: 'name', label: 'Nome profissional', type: 'text', required: true, maxLength: 120 },
  { name: 'fullName', label: 'Nome completo', type: 'text', required: true, maxLength: 160 },
  {
    name: 'headline',
    label: 'Título principal',
    type: 'text',
    required: true,
    maxLength: 200,
    wide: true,
  },
  {
    name: 'roles',
    label: 'Títulos alternados na abertura',
    type: 'list',
    required: true,
    rows: 4,
  },
  { name: 'tagline', label: 'Texto de apoio', type: 'textarea', required: true, maxLength: 400 },
  {
    name: 'about',
    label: 'Sobre mim',
    type: 'list',
    required: true,
    rows: 10,
    hint: 'Um parágrafo por linha.',
  },
  { name: 'githubUrl', label: 'GitHub', type: 'url', required: true },
  { name: 'linkedinUrl', label: 'LinkedIn', type: 'url', required: true },
  {
    name: 'publicEmail',
    label: 'E-mail público',
    type: 'email',
    wide: true,
    hint: 'Opcional. Só aparece no site quando preenchido.',
  },
  {
    name: 'resumeUrl',
    label: 'Currículo (PDF)',
    type: 'pdf',
    hint: 'O botão “Baixar currículo” só aparece no site quando há um arquivo.',
  },
]
