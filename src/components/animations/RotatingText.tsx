import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { EASE_OUT } from './easing'

interface RotatingTextProps {
  items: string[]
  /** Rótulo lido antes da lista completa por leitores de tela. */
  label: string
  intervalMs?: number
  /** Aplicado ao texto visível (não ao texto para leitores de tela). */
  className?: string
}

/**
 * Alterna suavemente entre textos. Leitores de tela recebem a lista completa
 * de uma vez; a rotação pausa no hover e não roda com movimento reduzido.
 */
export function RotatingText({ items, label, intervalMs = 2800, className }: RotatingTextProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reducedMotion = useReducedMotion()
  const shouldRotate = items.length > 1 && !paused && !reducedMotion

  useEffect(() => {
    if (!shouldRotate) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length)
    }, intervalMs)
    return () => window.clearInterval(timer)
  }, [shouldRotate, items.length, intervalMs])

  const current = items[index % items.length] ?? ''

  return (
    <span
      className="relative inline-flex min-h-[1.3em] overflow-hidden"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <span className="sr-only">
        {label} {items.join(', ')}.
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={current}
          aria-hidden="true"
          className={cn('inline-block', className)}
          initial={{ opacity: 0, y: '0.5em' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-0.5em' }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          {current}
        </m.span>
      </AnimatePresence>
    </span>
  )
}
