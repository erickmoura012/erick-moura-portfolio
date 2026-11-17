import { useEffect } from 'react'
import { useLocation } from 'react-router'

/** Tempo máximo esperando uma seção carregada sob demanda aparecer no DOM. */
const ANCHOR_WAIT_MS = 2000

/**
 * Posição de scroll a cada navegação: rola até a âncora quando há hash,
 * senão volta ao topo. O `key` faz o efeito rodar mesmo ao repetir o mesmo link.
 * Como as seções abaixo da dobra são carregadas sob demanda, a âncora pode
 * surgir alguns instantes depois da navegação — nesse caso, aguardamos por ela.
 */
export function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }

    const id = decodeURIComponent(hash.slice(1))
    const startedAt = performance.now()
    let frame = 0

    const tryScroll = () => {
      const target = document.getElementById(id)
      if (target) {
        target.scrollIntoView()
        return
      }
      if (performance.now() - startedAt < ANCHOR_WAIT_MS) {
        frame = requestAnimationFrame(tryScroll)
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }
    }

    tryScroll()
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash, key])

  return null
}
