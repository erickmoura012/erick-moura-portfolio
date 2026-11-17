import { useId } from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  /** Exibe o nome ao lado do monograma. */
  withName?: boolean
}

/** Monograma "EM" em traço contínuo, dentro de uma moldura com gradiente. */
export function Logo({ className, withName = false }: LogoProps) {
  const gradientId = useId()

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" className="size-9 shrink-0">
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2="32"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <rect
          x="1"
          y="1"
          width="30"
          height="30"
          rx="9"
          fill="var(--background-alt)"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.5"
        />
        <path
          d="M13 10.5H7.5v11H13M7.5 16h4.5M16.5 21.5v-11l4 5.5 4-5.5v11"
          fill="none"
          stroke="var(--foreground)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {withName ? (
        <span className="font-display text-base font-semibold tracking-tight text-foreground">
          Erick Moura
        </span>
      ) : null}
    </span>
  )
}
