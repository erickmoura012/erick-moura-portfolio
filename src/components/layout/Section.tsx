import type { ReactNode } from 'react'
import { Reveal } from '@/components/animations/Reveal'
import { cn } from '@/lib/utils'

interface SectionProps {
  id: string
  /** Número da seção, exibido grande na coluna lateral. */
  index: number
  eyebrow: string
  title: string
  /** Trecho do título que recebe o marca-texto. */
  highlight?: string
  description?: string
  children: ReactNode
  className?: string
}

function HighlightedTitle({ title, highlight }: { title: string; highlight?: string }) {
  if (!highlight || !title.includes(highlight)) return <>{title}</>
  const [before, after] = title.split(highlight)
  return (
    <>
      {before}
      <span className="marker">{highlight}</span>
      {after}
    </>
  )
}

/**
 * Seção com estrutura editorial: linha divisória no topo, número e rótulo numa
 * coluna lateral (fixa no desktop) e conteúdo à direita.
 */
export function Section({
  id,
  index,
  eyebrow,
  title,
  highlight,
  description,
  children,
  className,
}: SectionProps) {
  const titleId = `${id}-titulo`
  const number = String(index).padStart(2, '0')

  return (
    <section id={id} aria-labelledby={titleId} className="scroll-mt-20 border-t border-border">
      <div
        className={cn(
          'container-page grid gap-8 py-20 frame-x sm:py-24 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-14',
          className,
        )}
      >
        <div className="flex items-baseline gap-4 lg:sticky lg:top-28 lg:flex-col lg:gap-3 lg:self-start">
          <span
            aria-hidden="true"
            className="font-display text-5xl leading-none font-medium tracking-tight text-foreground/90 lg:text-7xl"
          >
            {number}
          </span>
          <span className="label-mono text-cyan">{eyebrow}</span>
        </div>

        <div className="min-w-0">
          <Reveal className="mb-12 max-w-3xl sm:mb-14">
            <h2
              id={titleId}
              className="text-[2rem] leading-[1.08] font-semibold text-foreground sm:text-5xl"
            >
              <HighlightedTitle title={title} highlight={highlight} />
            </h2>
            {description ? (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                {description}
              </p>
            ) : null}
          </Reveal>
          {children}
        </div>
      </div>
    </section>
  )
}
