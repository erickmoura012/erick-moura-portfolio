import {
  ArrowDown,
  BrainCircuit,
  Check,
  CodeXml,
  ShieldCheck,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { Tabs } from 'radix-ui'
import { SECTION_IDS } from '@/app/sections'
import { Reveal } from '@/components/animations/Reveal'
import { Section } from '@/components/layout/Section'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useMessages } from '@/i18n'
import { SOLUTION_CATEGORIES, type SolutionCategory } from '@/types/content'

const AREA_ICONS: Record<SolutionCategory, LucideIcon> = {
  web: CodeXml,
  automation: Zap,
  ai: BrainCircuit,
  integration: Workflow,
}

export function SolutionsSection() {
  const t = useMessages()

  return (
    <Section
      id={SECTION_IDS.solutions}
      index={4}
      eyebrow={t.solutions.eyebrow}
      title={t.solutions.title}
      description={t.solutions.description}
    >
      <Reveal>
        <Tabs.Root defaultValue="automation">
          <Tabs.List
            aria-label={t.solutions.tabsLabel}
            className="-mx-5 mb-6 flex scrollbar-thin gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
          >
            {SOLUTION_CATEGORIES.map((category) => {
              const Icon = AREA_ICONS[category]
              return (
                <Tabs.Trigger
                  key={category}
                  value={category}
                  className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground data-[state=active]:border-accent/60 data-[state=active]:bg-accent/15 data-[state=active]:text-foreground"
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {t.solutions.areas[category].title}
                </Tabs.Trigger>
              )
            })}
          </Tabs.List>

          {SOLUTION_CATEGORIES.map((category) => {
            const area = t.solutions.areas[category]
            return (
              <Tabs.Content
                key={category}
                value={category}
                className="focus-visible:outline-offset-4 data-[state=active]:animate-fade-in"
              >
                <Card className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground">{area.title}</h3>
                    <p className="mt-3 leading-relaxed text-muted">{area.description}</p>

                    <h4 className="mt-7 mb-3 font-mono text-xs tracking-wider text-subtle uppercase">
                      {t.solutions.capabilitiesLabel}
                    </h4>
                    <ul className="flex flex-col gap-2.5">
                      {area.capabilities.map((capability) => (
                        <li
                          key={capability}
                          className="flex gap-3 text-sm leading-relaxed text-muted"
                        >
                          <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-cyan" />
                          {capability}
                        </li>
                      ))}
                    </ul>

                    <h4 className="mt-7 mb-3 font-mono text-xs tracking-wider text-subtle uppercase">
                      {t.solutions.themesLabel}
                    </h4>
                    <ul className="flex flex-wrap gap-2">
                      {area.themes.map((theme) => (
                        <li key={theme}>
                          <Badge variant="accent">{theme}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-border bg-background-alt/60 p-5 sm:p-6">
                    <h4 className="mb-5 font-mono text-xs tracking-wider text-subtle uppercase">
                      {t.solutions.flowLabel}
                    </h4>
                    <ol className="flex flex-col">
                      {area.flow.map((step, index) => (
                        <li key={step} className="flex flex-col">
                          {index > 0 ? (
                            <ArrowDown
                              aria-hidden="true"
                              className="my-1.5 ml-[1.0625rem] size-4 text-subtle"
                            />
                          ) : null}
                          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface/70 px-3.5 py-3">
                            <span
                              aria-hidden="true"
                              className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border-strong font-mono text-xs text-cyan"
                            >
                              {index + 1}
                            </span>
                            <span className="text-sm font-medium text-foreground">{step}</span>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </Card>
              </Tabs.Content>
            )
          })}
        </Tabs.Root>

        <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-subtle">
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          {t.solutions.confidentiality}
        </p>
      </Reveal>
    </Section>
  )
}
