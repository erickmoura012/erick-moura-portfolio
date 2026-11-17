/** Âncoras das seções da página inicial. */
export const SECTION_IDS = {
  home: 'inicio',
  about: 'sobre',
  experience: 'experiencia',
  skills: 'skills',
  solutions: 'solucoes',
  projects: 'projetos',
  github: 'github',
  education: 'formacao',
  contact: 'contato',
} as const

export type SectionKey = keyof typeof SECTION_IDS

/** Seções exibidas no menu, na ordem de navegação. */
export const NAV_SECTIONS = [
  'home',
  'about',
  'experience',
  'skills',
  'projects',
  'github',
  'contact',
] as const satisfies readonly SectionKey[]

export type NavSectionKey = (typeof NAV_SECTIONS)[number]

/**
 * Seções na ordem da página — a mesma numeração aparece no cabeçalho de cada
 * seção, no índice de atalhos e no menu mobile.
 */
export const INDEX_SECTIONS = [
  'about',
  'experience',
  'skills',
  'solutions',
  'projects',
  'github',
  'education',
  'contact',
] as const satisfies readonly SectionKey[]

export type IndexSectionKey = (typeof INDEX_SECTIONS)[number]

export function sectionNumber(key: IndexSectionKey): string {
  return String(INDEX_SECTIONS.indexOf(key) + 1).padStart(2, '0')
}

export function sectionHref(key: SectionKey): string {
  return `/#${SECTION_IDS[key]}`
}
