import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, CircleAlert, LoaderCircle, Lock } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation } from 'react-router'
import { z } from 'zod'
import { Logo } from '@/components/common/Logo'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Field, fieldA11y, Input } from '@/components/ui/form'
import { LoadingScreen } from '../components/StatusScreen'
import { useAuth } from './auth-context'

const loginSchema = z.object({
  email: z.string().trim().pipe(z.email('Informe um e-mail válido.')),
  password: z.string().min(1, 'Informe sua senha.'),
})

type LoginValues = z.infer<typeof loginSchema>

/** Mensagem única para qualquer falha: não revela se o e-mail existe. */
const LOGIN_ERROR = 'E-mail ou senha inválidos.'

export function LoginPage() {
  const { status, signIn } = useAuth()
  const location = useLocation()
  const [failed, setFailed] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  if (status === 'loading') return <LoadingScreen label="Verificando sessão…" />
  if (status === 'admin' || status === 'denied' || status === 'error') {
    const from = (location.state as { from?: string } | null)?.from
    return <Navigate to={from?.startsWith('/admin') ? from : '/admin'} replace />
  }

  const busy = isSubmitting || status === 'checking'

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setFailed(false)
    const accepted = await signIn(email, password)
    if (!accepted) setFailed(true)
  })

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 p-5">
      <Logo withName />

      <Card className="w-full max-w-sm p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-md border border-border bg-background-alt text-accent">
            <Lock aria-hidden="true" className="size-4" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Entrar no painel</h1>
            <p className="text-sm text-muted">Acesso restrito ao administrador.</p>
          </div>
        </div>

        <form noValidate onSubmit={(event) => void onSubmit(event)} className="flex flex-col gap-4">
          <Field id="login-email" label="E-mail" error={errors.email?.message}>
            <Input
              type="email"
              autoComplete="username"
              inputMode="email"
              {...fieldA11y('login-email', errors.email?.message)}
              {...register('email')}
            />
          </Field>
          <Field id="login-senha" label="Senha" error={errors.password?.message}>
            <Input
              type="password"
              autoComplete="current-password"
              {...fieldA11y('login-senha', errors.password?.message)}
              {...register('password')}
            />
          </Field>

          {failed ? (
            <p
              role="alert"
              className="flex items-center gap-2 rounded-md border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger"
            >
              <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
              {LOGIN_ERROR}
            </p>
          ) : null}

          <Button type="submit" disabled={busy} className="mt-1">
            {busy ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
            {busy ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>
      </Card>

      <Link
        to="/"
        className="inline-flex h-10 items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Voltar ao site
      </Link>
    </main>
  )
}
