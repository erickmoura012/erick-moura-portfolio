import { useSyncExternalStore } from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'em-theme'
const THEME_COLORS: Record<Theme, string> = { dark: '#050816', light: '#f5f7fb' }
const listeners = new Set<() => void>()

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function getServerSnapshot(): Theme {
  return 'dark'
}

/**
 * O tema vive no atributo `data-theme` do <html> (aplicado por um script inline
 * antes da primeira pintura). O React apenas observa esse valor.
 */
export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Armazenamento indisponível (modo privado): o tema vale só para esta visita.
  }
  listeners.forEach((listener) => listener())
}

export function toggleTheme(): void {
  setTheme(getSnapshot() === 'dark' ? 'light' : 'dark')
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
