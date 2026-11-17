import { Building2, ChevronDown, MapPin } from 'lucide-react'
import { useId, useState } from 'react'
import { SECTION_IDS } from '@/app/sections'
import { Reveal } from '@/components/animations/Reveal'
import { Section } from '@/components/layout/Section'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { usePortfolioContent } from '@/hooks/use-portfolio-content'
import { useMessages } from '@/i18n'
import { cn } from '@/lib/utils'
import type { Experience } from '@/types/content'

const VISIBLE_ACTIVITIES = 5

function ExperienceCard({ experience }: { experience: Experience }) {
  const t = useMessages()
  const listId = useId()
  const [expanded, setExpanded] = useState(false)
  const hiddenCount = Math.max(0, experience.activities.length - VISIBLE_ACTIVITIES)
  const activities = expanded
    ? experience.activities
    : experience.activities.slice(0, VISIBLE_ACTIVITIES)

  return (
    <Card interactive className="p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div>
          <h3 className="text-xl font-semibold text-foreground sm:text-2xl">{experience.role}</h3>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Building2 aria-hidden="true" className="size-4 text-accent" />
              {experience.company}
            </span>
            {experience.location ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin aria-hidden="true" className="size-4 text-accent" />
                {experience.location}
              </span>
            ) : null}
          </p>
        </div>
        <Badge variant={experience.isCurrent ? 'cyan' : 'neutral'} mono>
          {experience.periodLabel}
        </Badge>
      </div>

      <p className="mt-5 leading-relaxed text-muted">{experience.summary}</p>

      <h4 className="mt-6 mb-3 font-mono text-xs tracking-wider text-subtle uppercase">
        {t.experience.activitiesLabel}
      </h4>
      <ul id={listId} className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
        {activities.map((activity) => (
          <li key={activity} className="flex gap-3 text-sm leading-relaxed text-muted">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan" />
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
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-foreground"
        >
          {expanded ? t.experience.showLess : t.experience.showMore(hiddenCount)}
          <ChevronDown
            aria-hidden="true"
            className={cn('size-4 transition-transform duration-200', expanded && 'rotate-180')}
          />
        </button>
      ) : null}

      <ul aria-label={t.experience.tagsLabel} className="mt-6 flex flex-wrap gap-2">
        {experience.tags.map((tag) => (
          <li key={tag}>
            <Badge mono>{tag}</Badge>
          </li>
        ))}
      </ul>
    </Card>
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
      description={t.experience.description}
    >
      <ol className="relative ml-2 flex flex-col gap-8 border-l border-border sm:ml-3">
        {experiences.map((experience) => (
          <li key={experience.id} className="relative pl-7 sm:pl-10">
            <span
              aria-hidden="true"
              className={cn(
                'absolute top-8 -left-[0.4375rem] size-3.5 rounded-full border-2 bg-background',
                experience.isCurrent
                  ? 'border-cyan shadow-[0_0_0_4px_rgb(34_211_238/0.15)]'
                  : 'border-border-strong',
              )}
            />
            <Reveal>
              <ExperienceCard experience={experience} />
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}
