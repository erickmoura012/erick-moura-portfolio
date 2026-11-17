import { BrainCircuit, CodeXml, Workflow, Zap, type LucideIcon } from 'lucide-react'
import { SECTION_IDS } from '@/app/sections'
import { Reveal } from '@/components/animations/Reveal'
import { Section } from '@/components/layout/Section'
import { useFeaturedProjects, usePortfolioContent } from '@/hooks/use-portfolio-content'
import { useMessages } from '@/i18n'

const HIGHLIGHT_ICONS: Record<string, LucideIcon> = {
  fullstack: CodeXml,
  automation: Zap,
  ai: BrainCircuit,
  integration: Workflow,
}

function Facts() {
  const t = useMessages()
  const { profile, experiences, education } = usePortfolioContent()
  const { all: projects } = useFeaturedProjects()
  const current = experiences.find((experience) => experience.isCurrent) ?? experiences[0]
  const degree = education.find((item) => item.kind === 'degree') ?? education[0]

  const rows: [label: string, value: string][] = [
    [t.about.facts.name, profile.fullName],
    ...(current
      ? ([[t.about.facts.role, `${current.role} · ${current.company}`]] as [string, string][])
      : []),
    ...(degree
      ? ([
          [
            t.about.facts.education,
            `${degree.title} · ${degree.institution}${degree.status === 'in_progress' ? ` (${t.education.statuses.in_progress.toLowerCase()})` : ''}`,
          ],
        ] as [string, string][])
      : []),
    [t.about.facts.focus, t.about.facts.focusValue],
    [t.about.facts.projects, projects.map((project) => project.title).join(' · ')],
  ]

  return (
    <div className="rounded-card border border-border">
      <h3 className="border-b border-border px-5 py-3 label-mono text-subtle">
        {t.about.factsTitle}
      </h3>
      <dl className="divide-y divide-border">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[7rem_1fr] sm:gap-4">
            <dt className="label-mono text-subtle sm:pt-0.5">{label}</dt>
            <dd className="text-sm leading-relaxed text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function AboutSection() {
  const t = useMessages()
  const { profile } = usePortfolioContent()
  const [lead, ...paragraphs] = profile.about

  return (
    <Section
      id={SECTION_IDS.about}
      index={1}
      eyebrow={t.about.eyebrow}
      title={t.about.title}
      highlight={t.about.titleHighlight}
    >
      <div className="grid gap-12 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] xl:gap-14">
        <Reveal className="flex max-w-2xl flex-col gap-5">
          {lead ? (
            <p className="text-lg leading-relaxed text-foreground sm:text-xl sm:leading-relaxed">
              {lead}
            </p>
          ) : null}
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </Reveal>

        <Reveal delay={0.06} className="self-start">
          <Facts />
        </Reveal>
      </div>

      <Reveal className="mt-16">
        <h3 className="mb-5 label-mono text-subtle">{t.about.highlightsTitle}</h3>
        <ul className="grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2">
          {t.about.highlights.map((highlight, index) => {
            const Icon = HIGHLIGHT_ICONS[highlight.id] ?? CodeXml
            return (
              <li key={highlight.id} className="flex gap-4 bg-background p-5 sm:p-6">
                <span className="font-mono text-xs text-subtle">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h4 className="flex items-center gap-2.5 font-sans text-base font-semibold tracking-normal text-foreground">
                    <Icon aria-hidden="true" className="size-4 text-electric" />
                    {highlight.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{highlight.description}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </Reveal>

      <Reveal className="mt-16">
        <h3 className="mb-6 label-mono text-subtle">{t.about.timelineTitle}</h3>
        <ol className="grid gap-y-8 md:grid-cols-4 md:gap-x-6">
          {t.about.timeline.map((item) => (
            <li
              key={item.title}
              className="relative border-l border-border pl-6 md:border-t md:border-l-0 md:pt-6 md:pl-0"
            >
              <span
                aria-hidden="true"
                className="absolute top-1 -left-[0.3125rem] size-2.5 rotate-45 bg-electric md:-top-[0.3125rem] md:left-0"
              />
              <p className="label-mono text-cyan">{item.period}</p>
              <h4 className="mt-2 text-base font-semibold text-foreground">{item.title}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  )
}
