import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight,
  Briefcase,
  FolderKanban,
  GraduationCap,
  Inbox,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { keysToCamel } from '@/lib/utils'
import { ErrorState, PageHeader } from '../components/PageStates'
import {
  ADMIN_LOCALE,
  adminKeys,
  describeError,
  formatAdminDate,
  requireSupabase,
} from '../lib/client'
import { MESSAGE_STATUS_LABELS, type MessageStatus } from '../messages/api'

interface LatestMessage {
  id: string
  name: string
  subject: string
  status: MessageStatus
  createdAt: string
}

interface SyncInfo {
  syncedAt: string | null
  status: 'success' | 'error'
  errorMessage: string | null
}

interface DashboardData {
  counts: Record<'projects' | 'skills' | 'experiences' | 'education' | 'newMessages', number>
  latestMessages: LatestMessage[]
  sync: SyncInfo | null
}

async function loadDashboard(): Promise<DashboardData> {
  const supabase = await requireSupabase()

  const countContent = async (table: string): Promise<number> => {
    const { count, error } = await supabase
      .from(table)
      .select('id', { count: 'exact', head: true })
      .eq('locale', ADMIN_LOCALE)
    if (error) throw error
    return count ?? 0
  }

  const [projects, skills, experiences, education, newMessages, latest, sync] = await Promise.all([
    countContent('projects'),
    countContent('skills'),
    countContent('experiences'),
    countContent('education'),
    supabase
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new'),
    supabase
      .from('contact_messages')
      .select('id, name, subject, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('github_sync_metadata')
      .select('synced_at, status, error_message')
      .eq('id', 1)
      .maybeSingle(),
  ])
  if (newMessages.error) throw newMessages.error
  if (latest.error) throw latest.error
  if (sync.error) throw sync.error

  return {
    counts: { projects, skills, experiences, education, newMessages: newMessages.count ?? 0 },
    latestMessages: ((latest.data ?? []) as Record<string, unknown>[]).map((row) =>
      keysToCamel<LatestMessage>(row),
    ),
    sync: sync.data ? keysToCamel<SyncInfo>(sync.data as Record<string, unknown>) : null,
  }
}

function StatLink({
  to,
  label,
  value,
  icon: Icon,
}: {
  to: string
  label: string
  value: number
  icon: LucideIcon
}) {
  return (
    <Link to={to} className="group block rounded-card">
      <Card interactive className="flex items-center gap-4 p-5">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background-alt text-accent">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm text-muted">{label}</span>
          <span className="block font-sans text-2xl font-semibold text-foreground tabular-nums">
            {value}
          </span>
        </span>
        <ArrowRight
          aria-hidden="true"
          className="size-4 text-subtle transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </Card>
    </Link>
  )
}

export function DashboardPage() {
  const dashboard = useQuery({ queryKey: adminKeys.dashboard, queryFn: loadDashboard })

  return (
    <div>
      <PageHeader
        title="Visão geral"
        description="Resumo do conteúdo publicado, das mensagens e da sincronização com o GitHub."
      />

      {dashboard.isPending ? (
        <div role="status" aria-label="Carregando" className="grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-24 rounded-card" />
          ))}
        </div>
      ) : dashboard.isError ? (
        <ErrorState
          message={describeError(dashboard.error)}
          onRetry={() => void dashboard.refetch()}
        />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatLink
              to="/admin/projetos"
              label="Projetos"
              value={dashboard.data.counts.projects}
              icon={FolderKanban}
            />
            <StatLink
              to="/admin/skills"
              label="Skills"
              value={dashboard.data.counts.skills}
              icon={Wrench}
            />
            <StatLink
              to="/admin/experiencias"
              label="Experiências"
              value={dashboard.data.counts.experiences}
              icon={Briefcase}
            />
            <StatLink
              to="/admin/formacao"
              label="Formação"
              value={dashboard.data.counts.education}
              icon={GraduationCap}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <Card className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                  <Inbox aria-hidden="true" className="size-4 text-accent" />
                  Últimas mensagens
                  {dashboard.data.counts.newMessages > 0 ? (
                    <Badge variant="cyan">
                      {dashboard.data.counts.newMessages}{' '}
                      {dashboard.data.counts.newMessages === 1 ? 'nova' : 'novas'}
                    </Badge>
                  ) : null}
                </h2>
                <Link
                  to="/admin/mensagens"
                  className="text-sm font-medium text-accent transition-colors hover:text-foreground"
                >
                  Ver todas
                </Link>
              </div>
              {dashboard.data.latestMessages.length === 0 ? (
                <p className="mt-4 text-sm text-muted">Nenhuma mensagem recebida ainda.</p>
              ) : (
                <ul className="mt-3">
                  {dashboard.data.latestMessages.map((message) => (
                    <li
                      key={message.id}
                      className="flex items-center gap-3 border-b border-border py-3 last:border-b-0"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">
                          {message.subject}
                        </span>
                        <span className="block truncate text-xs text-muted">
                          {message.name} · {formatAdminDate(message.createdAt)}
                        </span>
                      </span>
                      <Badge variant={message.status === 'new' ? 'cyan' : 'neutral'}>
                        {MESSAGE_STATUS_LABELS[message.status]}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="flex flex-col gap-3 p-5 sm:p-6">
              <h2 className="text-base font-semibold text-foreground">Sincronização do GitHub</h2>
              {dashboard.data.sync ? (
                <>
                  <Badge
                    variant={dashboard.data.sync.status === 'success' ? 'success' : 'danger'}
                    className="self-start"
                  >
                    {dashboard.data.sync.status === 'success' ? 'Concluída' : 'Com erro'}
                  </Badge>
                  <p className="text-sm text-muted">
                    Última sincronização: {formatAdminDate(dashboard.data.sync.syncedAt)}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted">
                  Ainda não executada. O site usa a API pública do GitHub enquanto isso.
                </p>
              )}
              <Link
                to="/admin/github"
                className="mt-auto text-sm font-medium text-accent transition-colors hover:text-foreground"
              >
                Abrir sincronização
              </Link>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
