import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { Toaster } from 'sonner'
import { useTheme } from '@/hooks/use-theme'
import { isSupabaseConfigured } from '@/lib/env'
import { AuthProvider } from './auth/AuthProvider'
import { LoginPage } from './auth/LoginPage'
import { RequireAdmin } from './auth/RequireAdmin'
import { AdminLayout } from './layout/AdminLayout'
import { DashboardPage } from './pages/DashboardPage'
import { GithubPage } from './pages/GithubPage'
import { MessagesPage } from './pages/MessagesPage'
import { PendingSetupPage } from './pages/PendingSetupPage'
import { ProfilePage } from './pages/ProfilePage'
import {
  educationConfig,
  experiencesConfig,
  projectsConfig,
  skillsConfig,
} from './resources/configs'
import { ResourceManager } from './resources/ResourceManager'

const ADMIN_TITLE = 'Painel | Erick Moura'

/** O painel nunca deve ser indexado; a tag sai junto com o painel. */
function useAdminDocument(): void {
  useEffect(() => {
    const previousTitle = document.title
    document.title = ADMIN_TITLE

    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.append(robots)

    return () => {
      document.title = previousTitle
      robots.remove()
    }
  }, [])
}

/**
 * Painel administrativo (rota /admin/*). Sem Supabase configurado, mostra
 * apenas as instruções de configuração — nenhuma ação fica disponível.
 */
export function AdminApp() {
  const theme = useTheme()
  useAdminDocument()

  if (!isSupabaseConfigured) return <PendingSetupPage />

  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route
              path="projetos"
              element={<ResourceManager key="projects" config={projectsConfig} />}
            />
            <Route path="skills" element={<ResourceManager key="skills" config={skillsConfig} />} />
            <Route
              path="experiencias"
              element={<ResourceManager key="experiences" config={experiencesConfig} />}
            />
            <Route
              path="formacao"
              element={<ResourceManager key="education" config={educationConfig} />}
            />
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="mensagens" element={<MessagesPage />} />
            <Route path="github" element={<GithubPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>
      </Routes>
      <Toaster theme={theme} position="bottom-right" closeButton />
    </AuthProvider>
  )
}
