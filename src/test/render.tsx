import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import type { ReactElement, ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { UiStateProvider } from '@/app/providers/ui-state'

interface Options extends Omit<RenderOptions, 'wrapper'> {
  route?: string
}

/** Renderiza com os mesmos providers da aplicação, isolando o cache por teste. */
export function renderWithProviders(ui: ReactElement, { route = '/', ...options }: Options = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  })

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MotionConfig reducedMotion="always">
          <UiStateProvider>
            <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
          </UiStateProvider>
        </MotionConfig>
      </QueryClientProvider>
    )
  }

  return { queryClient, ...render(ui, { wrapper: Wrapper, ...options }) }
}
