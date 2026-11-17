import { m } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE_OUT } from './easing'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Atraso em segundos, útil para escalonar itens de uma lista. */
  delay?: number
  /** Deslocamento vertical inicial em pixels. */
  offset?: number
}

/**
 * Entrada suave ativada pelo scroll. Com `prefers-reduced-motion`, o
 * `MotionConfig` global remove o deslocamento e mantém apenas o fade.
 */
export function Reveal({ children, className, delay = 0, offset = 24 }: RevealProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT }}
    >
      {children}
    </m.div>
  )
}
