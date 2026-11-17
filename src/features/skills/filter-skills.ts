import type { Skill, SkillCategory } from '@/types/content'

/** "learning" filtra pelo nível, atravessando todas as categorias. */
export type SkillFilter = 'all' | 'learning' | SkillCategory

export function filterSkills(skills: Skill[], filter: SkillFilter): Skill[] {
  if (filter === 'all') return skills
  if (filter === 'learning') return skills.filter((skill) => skill.level === 'learning')
  return skills.filter((skill) => skill.category === filter)
}
