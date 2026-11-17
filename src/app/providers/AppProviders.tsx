import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LazyMotion, MotionConfig } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { UiStateProvider } from './ui-state'

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 60_000 },
    },
  })
}

/** O motor de animação fica fora do bundle inicial e chega logo após a primeira pintura. */
const loadMotionFeatures = () =>
  import('@/components/animations/motion-features').then((module) => module.default)

export function AppProviders({ children }: { children: ReactNode }) {
  // Um cliente por instância da aplicação: seguro também na pré-renderização.
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <LazyMotion features={loadMotionFeatures} strict>
        <MotionConfig reducedMotion="user">
          <UiStateProvider>{children}</UiStateProvider>
        </MotionConfig>
      </LazyMotion>
    </QueryClientProvider>
  )
}
