import type { ComponentProps, PointerEvent } from 'react'
import { cn } from '@/lib/utils'

/** Atualiza as variáveis CSS usadas pelo utilitário `spotlight`. */
export function trackPointer(event: PointerEvent<HTMLElement>): void {
  if (event.pointerType !== 'mouse') return
  const element = event.currentTarget
  const rect = element.getBoundingClientRect()
  element.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  element.style.setProperty('--my', `${event.clientY - rect.top}px`)
}

export interface CardProps extends ComponentProps<'div'> {
  /** Realça o contorno no hover (para cards clicáveis ou com ações). */
  interactive?: boolean
}

/** Superfície plana com contorno fino — sem sombra nem vidro. */
export function Card({ className, interactive = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-card border border-border bg-surface/50',
        interactive && 'transition-colors duration-200 hover:border-border-strong',
        className,
      )}
      {...props}
    />
  )
}
