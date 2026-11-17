import { ArrowUpRight, Award, BookOpen, GraduationCap, MapPin, type LucideIcon } from 'lucide-react'
import { SECTION_IDS } from '@/app/sections'
import { Reveal } from '@/components/animations/Reveal'
import { ExternalLink } from '@/components/common/ExternalLink'
import { Section } from '@/components/layout/Section'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { usePortfolioContent } from '@/hooks/use-portfolio-content'
import { useMessages } from '@/i18n'
import type { EducationItem, EducationKind } from '@/types/content'

const KIND_ICONS: Record<EducationKind, LucideIcon> = {
  degree: GraduationCap,
  course: BookOpen,
  certification: Award,
}

function EducationHeader({ item }: { item: EducationItem }) {
  const t = useMessages()
  const Icon = KIND_ICONS[item.kind]

  return (
    <div className="flex items-start gap-4">
      <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-background-alt text-accent">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge mono>{t.education.kinds[item.kind]}</Badge>
          <Badge variant={item.status === 'in_progress' ? 'cyan' : 'success'} mono>
            {item.periodLabel ?? t.education.statuses[item.status]}
          </Badge>
        </div>
        <h3 className="mt-3 text-xl font-semibold text-foreground sm:text-2xl">{item.title}</h3>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span>{item.institution}</span>
          {item.location ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="size-3.5 text-accent" />
              {item.location}
            </span>
          ) : null}
        </p>
      </div>
    </div>
  )
}

function EducationCard({ item }: { item: EducationItem }) {
  const t = useMessages()

  return (
    <Card interactive className="h-full p-6 sm:p-8">
      <EducationHeader item={item} />
      {item.description ? (
        <p className="mt-5 leading-relaxed text-muted">{item.description}</p>
      ) : null}
      {item.topics.length > 0 ? (
        <>
          <h4 className="mt-6 mb-3 font-mono text-xs tracking-wider text-subtle uppercase">
            {t.education.topicsLabel}
          </h4>
          <ul className="flex flex-wrap gap-2">
            {item.topics.map((topic) => (
              <li key={topic}>
                <Badge variant="accent">{topic}</Badge>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {item.credentialUrl ? (
        <ExternalLink
          href={item.credentialUrl}
          className="mt-5 inline-flex h-11 items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-foreground"
        >
          {t.education.credential}
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </ExternalLink>
      ) : null}
    </Card>
  )
}

export function EducationSection() {
  const t = useMessages()
  const { education } = usePortfolioContent()
  const degrees = education.filter((item) => item.kind === 'degree')
  const courses = education.filter((item) => item.kind !== 'degree')

  return (
    <Section
      id={SECTION_IDS.education}
      index={7}
      eyebrow={t.education.eyebrow}
      title={t.education.title}
      description={t.education.description}
    >
      <ul className="grid gap-6">
        {degrees.map((item) => (
          <li key={item.id}>
            <Reveal>
              <EducationCard item={item} />
            </Reveal>
          </li>
        ))}
      </ul>

      {/* Cursos e certificações só aparecem quando há itens confirmados cadastrados. */}
      {courses.length > 0 ? (
        <div className="mt-12">
          <h3 className="mb-5 font-mono text-xs tracking-wider text-subtle uppercase">
            {t.education.coursesTitle}
          </h3>
          <ul className="grid gap-6 md:grid-cols-2">
            {courses.map((item, index) => (
              <li key={item.id}>
                <Reveal delay={index * 0.06} className="h-full">
                  <EducationCard item={item} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Section>
  )
}
