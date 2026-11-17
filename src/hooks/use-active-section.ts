import { useEffect, useState } from 'react'

/**
 * Retorna o id da seção que cruza a faixa central da janela.
 * `enabled` permite desligar a observação fora da página inicial.
 */
export function useActiveSection(ids: readonly string[], enabled = true): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)
  const idsKey = ids.join('|')

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return

    const elements = idsKey
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [idsKey, enabled])

  return enabled ? activeId : null
}
