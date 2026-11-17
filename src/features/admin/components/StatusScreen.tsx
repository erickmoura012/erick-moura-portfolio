import type { ReactNode } from 'react'
import { Logo } from '@/components/common/Logo'

interface StatusScreenProps {
  /** Rótulo técnico em fonte mono, no estilo do restante do site. */
  code: string
  title: string
  description?: ReactNode
  tone?: 'neutral' | 'danger' | 'warning'
  children?: ReactNode
}

const TONES = { neutral: 'text-cyan', danger: 'text-danger', warning: 'text-warning' } as const

/** Tela cheia para estados do painel: carregando, acesso negado, configuração pendente. */
export function StatusScreen({
  code,
  title,
  description,
  tone = 'neutral',
  children,
}: StatusScreenProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 p-6 text-center">
      <Logo />
      <p className={`font-mono text-xs tracking-wider uppercase ${TONES[tone]}`}>{code}</p>
      <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>
      {description ? (
        <div className="max-w-md leading-relaxed text-muted">{description}</div>
      ) : null}
      {children}
    </main>
  )
}

export function LoadingScreen({ label = 'Carregando…' }: { label?: string }) {
  return (
    <main role="status" className="flex min-h-dvh items-center justify-center">
      <span className="flex items-center gap-3 font-mono text-sm text-subtle">
        <span aria-hidden="true" className="size-2 animate-pulse rounded-full bg-cyan" />
        {label}
      </span>
    </main>
  )
}
