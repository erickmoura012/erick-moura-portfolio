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

export function sectionHref(key: SectionKey): string {
  return `/#${SECTION_IDS[key]}`
}
