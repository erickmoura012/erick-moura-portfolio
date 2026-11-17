import type { ReactNode } from 'react'
import { Reveal } from '@/components/animations/Reveal'
import { cn } from '@/lib/utils'

interface SectionProps {
  id: string
  /** Número da seção exibido no rótulo, no estilo `02 // sobre`. */
  index: number
  eyebrow: string
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function Section({
  id,
  index,
  eyebrow,
  title,
  description,
  children,
  className,
}: SectionProps) {
  const titleId = `${id}-titulo`

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn('container-page scroll-mt-24 py-20 sm:py-28', className)}
    >
      <Reveal className="mb-12 max-w-2xl sm:mb-16">
        <p className="mb-4 flex items-center gap-2 font-mono text-xs tracking-wider text-cyan uppercase">
          <span aria-hidden="true" className="text-subtle">
            {String(index).padStart(2, '0')} //
          </span>
          {eyebrow}
        </p>
        <h2 id={titleId} className="text-3xl font-semibold text-foreground sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{description}</p>
        ) : null}
      </Reveal>
      {children}
    </section>
  )
}
