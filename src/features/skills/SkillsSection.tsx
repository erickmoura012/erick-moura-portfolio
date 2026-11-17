import { useMemo, useState } from 'react'
import { SECTION_IDS } from '@/app/sections'
import { Reveal } from '@/components/animations/Reveal'
import { TechIcon } from '@/components/common/TechIcon'
import { Section } from '@/components/layout/Section'
import { usePortfolioContent } from '@/hooks/use-portfolio-content'
import { useMessages } from '@/i18n'
import { cn } from '@/lib/utils'
import { SKILL_CATEGORIES, SKILL_LEVELS, type Skill, type SkillLevel } from '@/types/content'
import { filterSkills, type SkillFilter } from './filter-skills'

/** Marcador de nível: cheio, meio preenchido ou vazado — legível sem depender de cor. */
function LevelMark({ level }: { level: SkillLevel }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block size-2.5 shrink-0 rounded-[2px] border border-electric',
        level === 'professional' && 'bg-electric',
        level === 'projects' && 'bg-[linear-gradient(135deg,var(--electric)_50%,transparent_50%)]',
      )}
    />
  )
}

function SkillItem({ skill }: { skill: Skill }) {
  const t = useMessages()
  return (
    <li className="flex gap-3 bg-background p-4">
      <TechIcon name={skill.icon} className="mt-0.5 size-[1.125rem] shrink-0 text-foreground/70" />
      <div className="min-w-0">
        <h3 className="font-sans text-[0.9375rem] leading-snug font-semibold tracking-normal text-foreground">
          {skill.name}
        </h3>
        <p className="mt-1 text-sm leading-snug text-muted">{skill.description}</p>
        <p className="mt-2 flex items-center gap-2 label-mono text-subtle">
          <LevelMark level={skill.level} />
          {t.skills.levels[skill.level]}
        </p>
      </div>
    </li>
  )
}

export function SkillsSection() {
  const t = useMessages()
  const { skills } = usePortfolioContent()
  const [filter, setFilter] = useState<SkillFilter>('all')

  const filters = useMemo<{ id: SkillFilter; label: string }[]>(
    () => [
      { id: 'all', label: t.skills.all },
      ...SKILL_CATEGORIES.map((category) => ({
        id: category,
        label: t.skills.categories[category],
      })),
      { id: 'learning', label: t.skills.learningFilter },
    ],
    [t],
  )
  const visible = useMemo(() => filterSkills(skills, filter), [skills, filter])
  const groups = SKILL_CATEGORIES.map((category) => ({
    category,
    items: visible.filter((skill) => skill.category === category),
  })).filter((group) => group.items.length > 0)

  return (
    <Section
      id={SECTION_IDS.skills}
      index={3}
      eyebrow={t.skills.eyebrow}
      title={t.skills.title}
      highlight={t.skills.titleHighlight}
      description={t.skills.description}
    >
      <Reveal>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div role="group" aria-label={t.skills.filterLabel} className="flex flex-wrap gap-2">
            {filters.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
                className={cn(
                  'inline-flex h-9 items-center rounded-md border px-3.5 text-sm font-medium transition-colors',
                  filter === id
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground/75 hover:border-border-strong hover:text-foreground',
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <p aria-live="polite" className="label-mono text-subtle">
            {t.skills.count(visible.length)}
          </p>
        </div>

        <ul aria-label={t.skills.legendLabel} className="mb-8 flex flex-wrap gap-x-6 gap-y-2">
          {SKILL_LEVELS.map((level) => (
            <li key={level} className="flex items-center gap-2 text-sm text-muted">
              <LevelMark level={level} />
              {t.skills.levels[level]}
            </li>
          ))}
        </ul>

        <div className="divide-y divide-border border-y border-border">
          {groups.map(({ category, items }) => (
            <div
              key={category}
              className="grid gap-4 py-6 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-8"
            >
              <div className="flex items-baseline justify-between gap-3 lg:block">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {t.skills.categories[category]}
                </h3>
                <p aria-hidden="true" className="font-mono text-xs text-subtle lg:mt-1">
                  {String(items.length).padStart(2, '0')}
                </p>
              </div>
              <ul className="grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 xl:grid-cols-3">
                {items.map((skill) => (
                  <SkillItem key={skill.id} skill={skill} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
