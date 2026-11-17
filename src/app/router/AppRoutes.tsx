import { lazy, Suspense, type ReactNode } from 'react'
import { Route, Routes } from 'react-router'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { HomePage } from '@/features/home/HomePage'
import { RouteFallback } from './RouteFallback'

// Páginas secundárias e o painel ficam em bundles próprios. As públicas continuam
// pré-renderizadas: o HTML chega pronto e o código é baixado só para hidratar.
const ProjectPage = lazy(() =>
  import('@/features/projects/ProjectPage').then((module) => ({ default: module.ProjectPage })),
)
const NotFoundPage = lazy(() =>
  import('@/features/not-found/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)
// O painel administrativo nunca é baixado por visitantes.
const AdminApp = lazy(() =>
  import('@/features/admin/AdminApp').then((module) => ({ default: module.AdminApp })),
)

const withFallback = (page: ReactNode) => <Suspense fallback={<RouteFallback />}>{page}</Suspense>

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="projetos/:slug" element={withFallback(<ProjectPage />)} />
        <Route path="*" element={withFallback(<NotFoundPage />)} />
      </Route>
      <Route path="admin/*" element={withFallback(<AdminApp />)} />
    </Routes>
  )
}
