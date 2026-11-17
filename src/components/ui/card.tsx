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
  /** Adiciona realce que acompanha o cursor e elevação no hover. */
  interactive?: boolean
}

export function Card({ className, interactive = false, onPointerMove, ...props }: CardProps) {
  return (
    <div
      onPointerMove={(event) => {
        if (interactive) trackPointer(event)
        onPointerMove?.(event)
      }}
      className={cn(
        'rounded-card border border-border bg-surface/60 shadow-card',
        interactive &&
          'spotlight transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-border-strong',
        className,
      )}
      {...props}
    />
  )
}
