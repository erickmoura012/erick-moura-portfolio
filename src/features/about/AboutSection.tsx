import { BrainCircuit, CodeXml, Workflow, Zap, type LucideIcon } from 'lucide-react'
import { SECTION_IDS } from '@/app/sections'
import { Reveal } from '@/components/animations/Reveal'
import { Section } from '@/components/layout/Section'
import { Card } from '@/components/ui/card'
import { usePortfolioContent } from '@/hooks/use-portfolio-content'
import { useMessages } from '@/i18n'

const HIGHLIGHT_ICONS: Record<string, LucideIcon> = {
  fullstack: CodeXml,
  automation: Zap,
  ai: BrainCircuit,
  integration: Workflow,
}

export function AboutSection() {
  const t = useMessages()
  const { profile } = usePortfolioContent()
  const [lead, ...paragraphs] = profile.about

  return (
    <Section id={SECTION_IDS.about} index={1} eyebrow={t.about.eyebrow} title={t.about.title}>
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <Reveal className="flex flex-col gap-5">
          {lead ? (
            <p className="text-lg leading-relaxed text-foreground sm:text-xl">{lead}</p>
          ) : null}
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </Reveal>

        <div>
          <h3 className="mb-5 font-mono text-xs tracking-wider text-subtle uppercase">
            {t.about.highlightsTitle}
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2">
            {t.about.highlights.map((highlight, index) => {
              const Icon = HIGHLIGHT_ICONS[highlight.id] ?? CodeXml
              return (
                <li key={highlight.id}>
                  <Reveal delay={index * 0.07} className="h-full">
                    <Card interactive className="group h-full p-5">
                      <span className="mb-4 inline-flex size-11 items-center justify-center rounded-xl border border-border bg-background-alt text-accent transition-colors duration-300 group-hover:border-accent/50 group-hover:text-cyan">
                        <Icon aria-hidden="true" className="size-5" />
                      </span>
                      <h4 className="text-base font-semibold text-foreground">{highlight.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {highlight.description}
                      </p>
                    </Card>
                  </Reveal>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <Reveal className="mt-16">
        <h3 className="mb-6 font-mono text-xs tracking-wider text-subtle uppercase">
          {t.about.timelineTitle}
        </h3>
        <ol className="grid gap-y-8 md:grid-cols-4 md:gap-x-6">
          {t.about.timeline.map((item) => (
            <li
              key={item.title}
              className="relative border-l border-border pl-6 md:border-t md:border-l-0 md:pt-6 md:pl-0"
            >
              <span
                aria-hidden="true"
                className="absolute top-1 -left-[0.3125rem] size-2.5 rounded-full border-2 border-cyan bg-background md:-top-[0.3125rem] md:left-0"
              />
              <p className="font-mono text-xs text-cyan">{item.period}</p>
              <h4 className="mt-2 text-base font-semibold text-foreground">{item.title}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  )
}
