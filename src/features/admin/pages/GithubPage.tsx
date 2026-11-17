import { isGithubData } from '@shared/github'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CircleAlert, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { clearGithubCache } from '@/features/github/data-source'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState, PageHeader } from '../components/PageStates'
import { adminKeys, describeError, formatAdminDate, requireSupabase } from '../lib/client'

interface SyncState {
  syncedAt: string | null
  status: 'success' | 'error'
  errorMessage: string | null
  username: string | null
  repoCount: number | null
  hasContributions: boolean
  hasActivity: boolean
}

/** `null` quando a sincronização nunca foi executada. */
async function loadSyncState(): Promise<SyncState | null> {
  const supabase = await requireSupabase()
  const { data, error } = await supabase
    .from('github_sync_metadata')
    .select('synced_at, status, error_message, payload')
    .eq('id', 1)
    .maybeSingle()
  if (error) throw error
  if (!data) return null

  const payload: unknown = data.payload
  const valid = isGithubData(payload)
  return {
    syncedAt: (data.synced_at as string | null) ?? null,
    status: data.status === 'error' ? 'error' : 'success',
    errorMessage: (data.error_message as string | null) ?? null,
    username: valid ? payload.username : null,
    repoCount: valid ? payload.repos.length : null,
    hasContributions: valid && payload.contributions !== null,
    hasActivity: valid && payload.activity !== null,
  }
}

/** A Edge Function valida o JWT desta sessão e confirma que o usuário é administrador. */
async function runSync(): Promise<void> {
  const supabase = await requireSupabase()
  const { error } = await supabase.functions.invoke('github-sync', { method: 'POST' })
  if (error) throw error
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-right text-sm font-medium text-foreground">{value}</dd>
    </div>
  )
}

export function GithubPage() {
  const queryClient = useQueryClient()
  const state = useQuery({ queryKey: adminKeys.githubSync, queryFn: loadSyncState })

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: adminKeys.githubSync }),
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard }),
      queryClient.invalidateQueries({ queryKey: ['github'] }),
    ])
  }

  const sync = useMutation({
    mutationFn: runSync,
    onSuccess: async () => {
      clearGithubCache()
      toast.success('Dados do GitHub sincronizados.')
      await refresh()
    },
    onError: async () => {
      toast.error('A sincronização falhou. Veja o estado registrado abaixo.')
      await refresh()
    },
  })

  return (
    <div>
      <PageHeader
        title="GitHub"
        description="Coleta os dados públicos no servidor, com token, e os guarda para o site."
        actions={
          <Button disabled={sync.isPending} onClick={() => sync.mutate()}>
            <RefreshCw aria-hidden="true" className={sync.isPending ? 'animate-spin' : undefined} />
            {sync.isPending ? 'Sincronizando…' : 'Sincronizar agora'}
          </Button>
        }
      />

      {state.isPending ? (
        <Skeleton className="h-56 rounded-card" />
      ) : state.isError ? (
        <ErrorState message={describeError(state.error)} onRetry={() => void state.refetch()} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-foreground">Última sincronização</h2>
              {state.data ? (
                <Badge variant={state.data.status === 'success' ? 'success' : 'danger'}>
                  {state.data.status === 'success' ? 'Concluída' : 'Com erro'}
                </Badge>
              ) : (
                <Badge>Nunca executada</Badge>
              )}
            </div>

            {state.data ? (
              <>
                <dl className="mt-3">
                  <Detail label="Executada em" value={formatAdminDate(state.data.syncedAt)} />
                  <Detail label="Usuário" value={state.data.username ?? '—'} />
                  <Detail
                    label="Repositórios"
                    value={state.data.repoCount === null ? '—' : String(state.data.repoCount)}
                  />
                  <Detail
                    label="Atividade pública recente"
                    value={state.data.hasActivity ? 'Incluída' : 'Não disponível'}
                  />
                  <Detail
                    label="Calendário de contribuições"
                    value={state.data.hasContributions ? 'Incluído' : 'Não incluído'}
                  />
                </dl>
                {state.data.status === 'error' && state.data.errorMessage ? (
                  <p
                    role="alert"
                    className="mt-4 flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-foreground"
                  >
                    <CircleAlert
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-danger"
                    />
                    {state.data.errorMessage}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Nenhum dado sincronizado ainda. Enquanto isso, o site consulta a API pública do
                GitHub direto do navegador e usa o snapshot versionado como reserva.
              </p>
            )}
          </Card>

          <Card className="p-5 sm:p-6">
            <h2 className="text-base font-semibold text-foreground">Como funciona</h2>
            <ul className="mt-4 flex list-disc flex-col gap-3 pl-5 text-sm leading-relaxed text-muted">
              <li>
                A função <code className="font-mono text-xs text-foreground">github-sync</code> roda
                no servidor; o token do GitHub nunca chega ao navegador.
              </li>
              <li>
                O calendário de contribuições só é incluído quando o segredo{' '}
                <code className="font-mono text-xs text-foreground">GITHUB_TOKEN</code> está
                configurado.
              </li>
              <li>
                Em caso de falha, os últimos dados válidos são mantidos e o erro fica registrado
                aqui.
              </li>
              <li>
                Visitantes que já abriram o site podem ver os dados anteriores por até uma hora
                (cache local).
              </li>
            </ul>
          </Card>
        </div>
      )}
    </div>
  )
}
