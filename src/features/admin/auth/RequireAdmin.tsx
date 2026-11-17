import { Navigate, Outlet, useLocation } from 'react-router'
import { Button } from '@/components/ui/button'
import { LoadingScreen, StatusScreen } from '../components/StatusScreen'
import { useAuth } from './auth-context'

/**
 * Guarda de rota do painel. Só melhora a experiência: mesmo que alguém a
 * contorne no navegador, o banco recusa leituras e escritas sem `private.is_admin()`.
 */
export function RequireAdmin() {
  const { status, dismissDenied, retry } = useAuth()
  const location = useLocation()

  switch (status) {
    case 'loading':
      return <LoadingScreen label="Verificando sessão…" />
    case 'checking':
      return <LoadingScreen label="Confirmando permissões…" />
    case 'signed-out':
      return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    case 'denied':
      return (
        <StatusScreen
          code="403 · forbidden"
          tone="danger"
          title="Acesso negado"
          description="Esta conta não tem permissão de administrador. A sessão foi encerrada."
        >
          <Button variant="secondary" onClick={dismissDenied}>
            Voltar ao login
          </Button>
        </StatusScreen>
      )
    case 'error':
      return (
        <StatusScreen
          code="auth_check_failed"
          tone="warning"
          title="Não foi possível verificar o acesso"
          description="Confira sua conexão e tente novamente."
        >
          <Button variant="secondary" onClick={retry}>
            Tentar novamente
          </Button>
        </StatusScreen>
      )
    case 'admin':
      return <Outlet />
  }
}
