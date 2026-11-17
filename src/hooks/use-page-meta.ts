import { useEffect } from 'react'

/**
 * Atualiza título e descrição ao navegar entre rotas no cliente.
 * No HTML pré-renderizado, as mesmas informações são gravadas pelo script de build.
 */
export function usePageMeta(title: string, description?: string): void {
  useEffect(() => {
    document.title = title
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    }
  }, [title, description])
}
