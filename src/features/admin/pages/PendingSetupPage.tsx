import { ArrowLeft, Check, X } from 'lucide-react'
import { Link } from 'react-router'
import { Logo } from '@/components/common/Logo'
import { Card } from '@/components/ui/card'
import { env } from '@/lib/env'

const STEPS = [
  {
    title: 'Crie ou escolha o projeto no Supabase',
    detail: 'Use a sua própria conta. O painel não cria nem altera projetos por conta própria.',
  },
  {
    title: 'Aplique o schema e o conteúdo inicial',
    detail: 'npx supabase link --project-ref <ref> && npx supabase db push --include-seed',
    code: true,
  },
  {
    title: 'Informe as chaves públicas ao frontend',
    detail:
      'Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY em .env.local (e na hospedagem) e gere o build novamente.',
  },
  {
    title: 'Crie o usuário administrador',
    detail:
      'No dashboard do Supabase, crie o usuário em Authentication e insira o id dele em public.admin_users pelo SQL Editor.',
  },
  {
    title: 'Publique as Edge Functions',
    detail: 'npx supabase functions deploy contact github-sync',
    code: true,
  },
]

/** Exibida em /admin enquanto as variáveis do Supabase não estão definidas. */
export function PendingSetupPage() {
  const variables = [
    { name: 'VITE_SUPABASE_URL', defined: env.supabaseUrl !== null },
    { name: 'VITE_SUPABASE_PUBLISHABLE_KEY', defined: env.supabaseKey !== null },
  ]

  return (
    <main className="container-page flex min-h-dvh flex-col justify-center gap-8 py-12">
      <Logo withName />

      <div className="max-w-2xl">
        <p className="font-mono text-xs tracking-wider text-warning uppercase">setup_required</p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
          Configuração pendente
        </h1>
        <p className="mt-4 leading-relaxed text-muted">
          O painel administrativo depende do Supabase (autenticação, banco e armazenamento), que
          ainda não foi conectado a este ambiente. O site público continua funcionando com o
          conteúdo estático versionado no código.
        </p>
      </div>

      <div className="grid max-w-5xl items-start gap-6 lg:grid-cols-[minmax(19rem,0.75fr)_1.25fr]">
        <Card className="p-6">
          <h2 className="text-base font-semibold text-foreground">Variáveis de ambiente</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {variables.map((variable) => (
              <li key={variable.name} className="flex items-start gap-3 text-sm">
                {variable.defined ? (
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
                ) : (
                  <X aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-danger" />
                )}
                <span className="min-w-0">
                  <code className="font-mono text-xs break-words text-foreground">
                    {variable.name}
                  </code>
                  <span className="block text-xs text-muted">
                    {variable.defined ? 'definida' : 'não definida'}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-base font-semibold text-foreground">Como concluir</h2>
          <ol className="mt-4 flex flex-col gap-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border-strong font-mono text-xs text-cyan"
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{step.title}</p>
                  {step.code ? (
                    <code className="mt-1.5 block overflow-x-auto rounded-lg bg-background-alt px-3 py-2 font-mono text-xs whitespace-nowrap text-muted">
                      {step.detail}
                    </code>
                  ) : (
                    <p className="mt-1 text-sm leading-relaxed text-muted">{step.detail}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs text-subtle">
            O passo a passo completo, incluindo os segredos das funções, está em docs/DEPLOY.md e em
            supabase/functions/.env.example.
          </p>
        </Card>
      </div>

      <Link
        to="/"
        className="inline-flex h-10 items-center gap-2 self-start text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Voltar ao site
      </Link>
    </main>
  )
}
