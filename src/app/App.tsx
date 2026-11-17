import { useEffect } from 'react'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { AppProviders } from './providers/AppProviders'
import { AppRoutes } from './router/AppRoutes'

/** Sinaliza no <html> que a aplicação está interativa (usado por testes E2E e monitoramento). */
function useHydrationMarker() {
  useEffect(() => {
    document.documentElement.dataset.hydrated = 'true'
  }, [])
}

export function App() {
  useHydrationMarker()

  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </ErrorBoundary>
  )
}
