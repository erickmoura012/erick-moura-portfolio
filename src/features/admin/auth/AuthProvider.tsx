import type { Session } from '@supabase/supabase-js'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { requireSupabase } from '../lib/client'
import { AuthContext, type AuthContextValue, type AuthStatus } from './auth-context'

interface AuthState {
  status: AuthStatus
  email: string | null
}

const SIGNED_OUT: AuthState = { status: 'signed-out', email: null }

/**
 * Sessão do Supabase Auth + confirmação de administrador lendo a própria linha em
 * `admin_users` (a política de RLS só deixa cada usuário ver a sua).
 * Isto é apenas experiência de uso: quem autoriza de fato cada leitura e
 * escrita são as políticas de RLS do banco.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading', email: null })
  const [attempt, setAttempt] = useState(0)
  const verifiedUser = useRef<string | null>(null)
  const pendingUser = useRef<string | null>(null)

  const evaluate = useCallback(async (session: Session | null) => {
    if (!session) {
      verifiedUser.current = null
      pendingUser.current = null
      // "Acesso negado" continua na tela mesmo depois de a sessão ser encerrada.
      setState((current) => (current.status === 'denied' ? current : SIGNED_OUT))
      return
    }

    const userId = session.user.id
    const email = session.user.email ?? null
    if (verifiedUser.current === userId || pendingUser.current === userId) return

    pendingUser.current = userId
    setState({ status: 'checking', email })

    try {
      const supabase = await requireSupabase()
      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle()
      if (pendingUser.current !== userId) return
      pendingUser.current = null

      if (error) {
        setState({ status: 'error', email })
      } else if (data !== null) {
        verifiedUser.current = userId
        setState({ status: 'admin', email })
      } else {
        setState({ status: 'denied', email: null })
        await supabase.auth.signOut()
      }
    } catch {
      pendingUser.current = null
      setState({ status: 'error', email })
    }
  }, [])

  useEffect(() => {
    let active = true
    let unsubscribe: (() => void) | undefined

    void (async () => {
      try {
        const supabase = await requireSupabase()
        const { data } = await supabase.auth.getSession()
        if (!active) return
        await evaluate(data.session)

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'INITIAL_SESSION') return
          // Chamar a API do Supabase de dentro deste callback pode travar o
          // cliente; por isso a verificação é adiada para o próximo ciclo.
          setTimeout(() => {
            if (active) void evaluate(session)
          }, 0)
        })
        unsubscribe = () => listener.subscription.unsubscribe()
        if (!active) unsubscribe()
      } catch {
        if (active) setState({ status: 'error', email: null })
      }
    })()

    return () => {
      active = false
      unsubscribe?.()
    }
  }, [evaluate, attempt])

  const value = useMemo<AuthContextValue>(
    () => ({
      status: state.status,
      email: state.email,
      signIn: async (email, password) => {
        try {
          const supabase = await requireSupabase()
          setState((current) => (current.status === 'denied' ? SIGNED_OUT : current))
          const { error } = await supabase.auth.signInWithPassword({ email, password })
          return !error
        } catch {
          return false
        }
      },
      signOut: async () => {
        try {
          const supabase = await requireSupabase()
          await supabase.auth.signOut()
        } finally {
          verifiedUser.current = null
          pendingUser.current = null
          setState(SIGNED_OUT)
        }
      },
      dismissDenied: () => setState(SIGNED_OUT),
      retry: () => {
        setState({ status: 'loading', email: null })
        setAttempt((current) => current + 1)
      },
    }),
    [state],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
