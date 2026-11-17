/**
 * Contratos do conteúdo editorial do portfólio.
 * Os nomes de campo espelham as colunas do Supabase (camelCase ⇄ snake_case),
 * então a conversão entre app e banco é mecânica — ver `keysToCamel`/`keysToSnake`.
 */

export type Locale = 'pt-BR'

export interface Profile {
  name: string
  fullName: string
  headline: string
  roles: string[]
  tagline: string
  about: string[]
  githubUrl: string
  linkedinUrl: string
  /** Só é exibido quando configurado. Nunca preencher com valor presumido. */
  publicEmail: string | null
  /** URL do currículo em PDF. O botão de download só aparece quando existe. */
  resumeUrl: string | null
}

export interface Experience {
  id: string
  company: string
  role: string
  location: string | null
  periodLabel: string
  isCurrent: boolean
  summary: string
  activities: string[]
  tags: string[]
  sortOrder: number
}

export const SKILL_CATEGORIES = ['frontend', 'backend', 'ai', 'tools', 'platforms'] as const
export type SkillCategory = (typeof SKILL_CATEGORIES)[number]

/**
 * Níveis descritivos, sem porcentagens arbitrárias:
 * - professional: usado na atuação profissional atual
 * - projects: aplicado em projetos próprios e estudos
 * - learning: em aprendizado
 */
export const SKILL_LEVELS = ['professional', 'projects', 'learning'] as const
export type SkillLevel = (typeof SKILL_LEVELS)[number]

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  level: SkillLevel
  description: string
  /** Chave do registro de ícones (`src/components/common/TechIcon`). */
  icon: string
  sortOrder: number
}

export const EDUCATION_KINDS = ['degree', 'course', 'certification'] as const
export type EducationKind = (typeof EDUCATION_KINDS)[number]

export const EDUCATION_STATUSES = ['in_progress', 'completed'] as const
export type EducationStatus = (typeof EDUCATION_STATUSES)[number]

export interface EducationItem {
  id: string
  kind: EducationKind
  title: string
  institution: string
  location: string | null
  status: EducationStatus
  periodLabel: string | null
  description: string | null
  credentialUrl: string | null
  topics: string[]
  sortOrder: number
}

export const SOLUTION_CATEGORIES = ['web', 'automation', 'ai', 'integration'] as const
export type SolutionCategory = (typeof SOLUTION_CATEGORIES)[number]

export interface ProjectScreenshot {
  src: string
  alt: string
}

/** Projeto com conteúdo editorial — complementa os dados vindos da API do GitHub. */
export interface Project {
  id: string
  slug: string
  /** Nome do repositório no GitHub, quando o projeto tem código público. */
  repoName: string | null
  title: string
  tagline: string
  description: string
  challenge: string | null
  solution: string | null
  features: string[]
  architecture: string[]
  highlights: string[]
  stack: string[]
  screenshots: ProjectScreenshot[]
  repoUrl: string | null
  demoUrl: string | null
  category: SolutionCategory
  featured: boolean
  /** O projeto principal recebe a apresentação de destaque na home. */
  isPrimary: boolean
  sortOrder: number
}

export interface PortfolioContent {
  profile: Profile
  experiences: Experience[]
  skills: Skill[]
  education: EducationItem[]
  projects: Project[]
}
