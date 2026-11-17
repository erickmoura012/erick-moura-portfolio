import { Bot, Contact, Webhook, type LucideIcon } from 'lucide-react'
import { Fragment, type ReactNode } from 'react'
import { TechIcon } from '@/components/common/TechIcon'
import { usePortfolioContent } from '@/hooks/use-portfolio-content'
import { useMessages } from '@/i18n'

const TOKEN_PATTERN = /("[^"]*")|\b(const)\b|([A-Za-z_]+)(?=:)|([{}[\],;=:])/g

/** Realce de sintaxe mínimo, suficiente para o objeto exibido no editor. */
function highlight(line: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let cursor = 0

  for (const match of line.matchAll(TOKEN_PATTERN)) {
    const [text, string, keyword, property] = match
    const start = match.index
    if (start > cursor) nodes.push(line.slice(cursor, start))

    const color = string
      ? 'var(--code-string)'
      : keyword
        ? 'var(--code-keyword)'
        : property
          ? 'var(--code-property)'
          : 'var(--code-punctuation)'
    nodes.push(
      <span key={start} style={{ color }}>
        {text}
      </span>,
    )
    cursor = start + text.length
  }

  if (cursor < line.length) nodes.push(line.slice(cursor))
  return nodes
}

function buildCode(name: string): string[] {
  return [
    'const developer = {',
    `  name: "${name}",`,
    '  role: "Full Stack Developer",',
    '  focus: [',
    '    "Web Development",',
    '    "Automation",',
    '    "Artificial Intelligence",',
    '  ],',
    '  mindset: "Always learning",',
    '};',
  ]
}

const WORKFLOW_ICONS: (LucideIcon | 'n8n')[] = [Webhook, 'n8n', Bot, Contact]

function Connector() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 2"
      preserveAspectRatio="none"
      className="h-0.5 min-w-3 flex-1"
    >
      <line
        x1="0"
        y1="1"
        x2="32"
        y2="1"
        stroke="var(--cyan)"
        strokeWidth="2"
        strokeDasharray="4 4"
        className="animate-dash"
      />
    </svg>
  )
}

export function HeroVisual() {
  const t = useMessages()
  const { profile } = usePortfolioContent()
  const code = buildCode(profile.name)

  return (
    <div
      role="img"
      aria-label={t.hero.visualDescription}
      className="relative mx-auto w-full max-w-xl min-w-0 lg:max-w-none"
    >
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[3rem] bg-[radial-gradient(closest-side,var(--glow-blue),transparent)]"
      />

      {/* Editor */}
      <div
        className="animate-rise overflow-hidden rounded-2xl border border-border-strong bg-background-alt/95 shadow-float"
        style={{ animationDelay: '200ms' }}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#f87171]/80" />
            <span className="size-2.5 rounded-full bg-[#fbbf24]/80" />
            <span className="size-2.5 rounded-full bg-[#34d399]/80" />
          </div>
          <span className="rounded-md border border-border bg-surface/70 px-2.5 py-1 font-mono text-xs text-muted">
            {t.hero.editorFile}
          </span>
          <span className="ml-auto font-mono text-[0.6875rem] text-subtle">TypeScript</span>
        </div>

        <pre className="scrollbar-thin overflow-x-auto px-4 py-5 font-mono text-[0.8125rem] leading-7 sm:pb-24 sm:text-sm">
          <code className="grid text-foreground">
            {code.map((line, index) => (
              <span
                key={index}
                className="flex animate-rise"
                style={{ animationDelay: `${420 + index * 70}ms` }}
              >
                <span className="w-8 shrink-0 pr-4 text-right text-subtle/70 select-none">
                  {index + 1}
                </span>
                <span className="whitespace-pre">
                  {highlight(line)}
                  {index === code.length - 1 ? (
                    <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-caret bg-cyan" />
                  ) : null}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>

      {/* Fluxo de automação */}
      <div
        className="relative mt-4 animate-rise rounded-2xl border border-border-strong glass p-4 shadow-float sm:absolute sm:-bottom-12 sm:left-6 sm:mt-0 sm:w-[21rem] lg:-left-8"
        style={{ animationDelay: '1100ms' }}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="font-mono text-xs text-muted">{t.hero.workflowTitle}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 font-mono text-[0.6875rem] text-success">
            <span className="size-1.5 rounded-full bg-success" />
            {t.hero.workflowStatus}
          </span>
        </div>
        <div className="flex items-start">
          {t.hero.workflowNodes.map((label, index) => {
            const icon = WORKFLOW_ICONS[index] ?? Webhook
            const Icon = icon === 'n8n' ? null : icon
            return (
              <Fragment key={label}>
                {index > 0 ? (
                  <span className="flex h-11 flex-1 items-center px-1">
                    <Connector />
                  </span>
                ) : null}
                <span className="flex w-14 shrink-0 flex-col items-center gap-2">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-border-strong bg-surface text-accent">
                    {Icon ? <Icon className="size-5" /> : <TechIcon name="n8n" />}
                  </span>
                  <span className="text-center text-[0.6875rem] leading-tight text-muted">
                    {label}
                  </span>
                </span>
              </Fragment>
            )
          })}
        </div>
      </div>

      {/* Reserva o espaço do card sobreposto para não cobrir o conteúdo seguinte. */}
      <div aria-hidden="true" className="hidden h-12 sm:block" />
    </div>
  )
}
