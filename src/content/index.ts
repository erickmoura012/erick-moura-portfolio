import type { Locale, PortfolioContent } from '@/types/content'
import { education } from './pt-BR/education'
import { experiences } from './pt-BR/experiences'
import { profile } from './pt-BR/profile'
import { projects } from './pt-BR/projects'
import { skills } from './pt-BR/skills'

/**
 * Conteúdo estático versionado: é exibido imediatamente, serve de fallback quando
 * o Supabase não está configurado e dá origem ao seed do banco (`npm run seed:generate`).
 * Para adicionar um idioma, crie a pasta do locale e registre-a aqui.
 */
export const staticContent: Record<Locale, PortfolioContent> = {
  'pt-BR': { profile, experiences, skills, education, projects },
}
