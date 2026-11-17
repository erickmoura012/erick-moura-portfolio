import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'
import { SECTION_IDS } from '@/app/sections'
import { Reveal } from '@/components/animations/Reveal'
import { Section } from '@/components/layout/Section'
import { usePortfolioContent } from '@/hooks/use-portfolio-content'
import { useMessages } from '@/i18n'
import { cn } from '@/lib/utils'
import type { Experience } from '@/types/content'

const VISIBLE_ACTIVITIES = 6

function ExperienceRow({ experience }: { experience: Experience }) {
  const t = useMessages()
  const listId = useId()
  const [expanded, setExpanded] = useState(false)
  const hiddenCount = Math.max(0, experience.activities.length - VISIBLE_ACTIVITIES)
  const activities = expanded
    ? experience.activities
    : experience.activities.slice(0, VISIBLE_ACTIVITIES)

  return (
    <article className="grid gap-6 py-10 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10">
      <header className="md:pt-1">
        <p
          className={cn(
            'flex items-center gap-2 label-mono',
            experience.isCurrent ? 'text-cyan' : 'text-subtle',
          )}
        >
          {experience.isCurrent ? (
            <span aria-hidden="true" className="size-1.5 rounded-full bg-cyan" />
          ) : null}
          {experience.periodLabel}
        </p>
        <p className="mt-3 text-sm font-medium text-foreground">{experience.company}</p>
        {experience.location ? (
          <p className="mt-1 text-sm text-subtle">{experience.location}</p>
        ) : null}
      </header>

      <div className="min-w-0">
        <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">{experience.role}</h3>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted">{experience.summary}</p>

        <h4 className="mt-7 mb-3 label-mono text-subtle">{t.experience.activitiesLabel}</h4>
        <ul id={listId} className="grid gap-x-8 sm:grid-cols-2">
          {activities.map((activity) => (
            <li
              key={activity}
              className="flex gap-3 border-b border-border py-2.5 text-sm leading-relaxed text-muted"
            >
              <span aria-hidden="true" className="mt-px font-mono text-xs text-electric">
                →
              </span>
              {activity}
            </li>
          ))}
        </ul>

        {hiddenCount > 0 ? (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls={listId}
            className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium text-foreground transition-colors hover:border-border-strong"
          >
            {expanded ? t.experience.showLess : t.experience.showMore(hiddenCount)}
            <ChevronDown
              aria-hidden="true"
              className={cn('size-4 transition-transform duration-200', expanded && 'rotate-180')}
            />
          </button>
        ) : null}

        <p className="mt-6 font-mono text-xs leading-relaxed text-subtle">
          <span className="sr-only">{t.experience.tagsLabel}: </span>
          {experience.tags.join('  /  ')}
        </p>
      </div>
    </article>
  )
}

export function ExperienceSection() {
  const t = useMessages()
  const { experiences } = usePortfolioContent()

  return (
    <Section
      id={SECTION_IDS.experience}
      index={2}
      eyebrow={t.experience.eyebrow}
      title={t.experience.title}
      highlight={t.experience.titleHighlight}
      description={t.experience.description}
    >
      <div className="-mt-10 divide-y divide-border">
        {experiences.map((experience) => (
          <Reveal key={experience.id}>
            <ExperienceRow experience={experience} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
