import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  /** Exibe o nome ao lado do monograma. */
  withName?: boolean
}

/**
 * Monograma "EM" em traço contínuo sobre bloco sólido, com o mesmo ponto azul
 * que fecha o nome na abertura do site.
 */
export function Logo({ className, withName = false }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" className="size-9 shrink-0">
        <rect x="0" y="0" width="32" height="32" rx="5" fill="var(--foreground)" />
        <path
          d="M13 10.5H7.5v11H13M7.5 16h4.5M16.5 21.5v-11l4 5.5 4-5.5v11"
          fill="none"
          stroke="var(--background)"
          strokeWidth="2.25"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <rect x="26" y="26" width="3.5" height="3.5" fill="var(--electric)" />
      </svg>
      {withName ? (
        <span className="font-display text-base font-semibold tracking-tight text-foreground">
          Erick Moura
        </span>
      ) : null}
    </span>
  )
}
