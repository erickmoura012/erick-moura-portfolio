import type { ComponentProps } from 'react'
import { useMessages } from '@/i18n'

/** Link externo seguro: nova aba, sem `opener`, com aviso para leitores de tela. */
export function ExternalLink({ children, ...props }: ComponentProps<'a'>) {
  const t = useMessages()
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <span className="sr-only"> {t.common.newTab}</span>
    </a>
  )
}
