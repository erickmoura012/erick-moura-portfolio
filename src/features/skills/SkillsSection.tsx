import { AnimatePresence, m } from 'motion/react'
import { useMemo, useState } from 'react'
import { SECTION_IDS } from '@/app/sections'
import { Reveal } from '@/components/animations/Reveal'
import { TechIcon } from '@/components/common/TechIcon'
import { Section } from '@/components/layout/Section'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { trackPointer } from '@/components/ui/card'
import { usePortfolioContent } from '@/hooks/use-portfolio-content'
import { useMessages } from '@/i18n'
import { cn } from '@/lib/utils'
import { SKILL_CATEGORIES, type Skill, type SkillLevel } from '@/types/content'
import { filterSkills, type SkillFilter } from './filter-skills'

const LEVEL_VARIANTS: Record<SkillLevel, BadgeProps['variant']> = {
  professional: 'cyan',
  projects: 'accent',
  learning: 'violet',
}

function SkillCard({ skill }: { skill: Skill }) {
  const t = useMessages()

  return (
    <div
      onPointerMove={trackPointer}
      className="group spotlight flex h-full flex-col rounded-2xl border border-border bg-surface/60 p-4 shadow-card transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-border-strong"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background-alt text-muted transition-colors duration-300 group-hover:text-foreground">
          <TechIcon name={skill.icon} />
        </span>
        <h3 className="font-sans text-[0.9375rem] leading-tight font-semibold tracking-normal text-foreground">
          {skill.name}
        </h3>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{skill.description}</p>
      <Badge variant={LEVEL_VARIANTS[skill.level]} className="mt-4 self-start">
        {t.skills.levels[skill.level]}
      </Badge>
    </div>
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

  return (
    <Section
      id={SECTION_IDS.skills}
      index={3}
      eyebrow={t.skills.eyebrow}
      title={t.skills.title}
      description={t.skills.description}
    >
      <Reveal>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div role="group" aria-label={t.skills.filterLabel} className="flex flex-wrap gap-2">
            {filters.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
                className={cn(
                  'inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors',
                  filter === id
                    ? 'border-accent/60 bg-accent/15 text-foreground'
                    : 'border-border text-muted hover:border-border-strong hover:text-foreground',
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <p aria-live="polite" className="font-mono text-xs text-subtle">
            {t.skills.count(visible.length)}
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-4 min-[30rem]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((skill) => (
              <m.li
                key={skill.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
              >
                <SkillCard skill={skill} />
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
      </Reveal>
    </Section>
  )
}
