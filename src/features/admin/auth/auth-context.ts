import { createContext, useContext } from 'react'

/**
 * - loading: lendo a sessão salva
 * - signed-out: sem sessão
 * - checking: sessão válida, confirmando se é administrador
 * - admin: liberado
 * - denied: autenticado, mas fora de `admin_users` (a sessão é encerrada)
 * - error: não foi possível verificar (rede ou backend)
 */
export type AuthStatus = 'loading' | 'signed-out' | 'checking' | 'admin' | 'denied' | 'error'

export interface AuthContextValue {
  status: AuthStatus
  email: string | null
  /** Resolve `true` quando as credenciais são aceitas. */
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
  /** Sai da tela de acesso negado e volta ao login. */
  dismissDenied: () => void
  retry: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth precisa estar dentro de <AuthProvider>.')
  return value
}
