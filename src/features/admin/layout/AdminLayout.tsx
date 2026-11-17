import { useQuery } from '@tanstack/react-query'
import {
  Briefcase,
  ExternalLink as ExternalLinkIcon,
  FolderKanban,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  User,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react'
import { Dialog } from 'radix-ui'
import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import { Logo } from '@/components/common/Logo'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '../auth/auth-context'
import { adminKeys } from '../lib/client'
import { countNewMessages } from '../messages/api'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/admin', label: 'Visão geral', icon: LayoutDashboard, end: true },
  { to: '/admin/projetos', label: 'Projetos', icon: FolderKanban },
  { to: '/admin/skills', label: 'Skills', icon: Wrench },
  { to: '/admin/experiencias', label: 'Experiências', icon: Briefcase },
  { to: '/admin/formacao', label: 'Formação', icon: GraduationCap },
  { to: '/admin/perfil', label: 'Perfil e links', icon: User },
  { to: '/admin/mensagens', label: 'Mensagens', icon: Inbox },
  { to: '/admin/github', label: 'GitHub', icon: RefreshCw },
]

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const unread = useQuery({
    queryKey: [...adminKeys.messages, 'unread'],
    queryFn: countNewMessages,
    staleTime: 60_000,
  })

  return (
    <nav aria-label="Seções do painel">
      <ul className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'border border-border-strong bg-surface-hover text-foreground'
                    : 'border border-transparent text-muted hover:bg-surface-hover/60 hover:text-foreground',
                )
              }
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {to === '/admin/mensagens' && unread.data ? (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[0.6875rem] font-semibold text-primary-foreground tabular-nums">
                  {unread.data}
                  <span className="sr-only">{unread.data === 1 ? ' nova' : ' novas'}</span>
                </span>
              ) : null}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Estrutura do painel: barra lateral (gaveta no mobile), barra superior e conteúdo. */
export function AdminLayout() {
  const { email, signOut } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-6 border-r border-border bg-background-alt/50 p-4 lg:flex">
        <Link to="/admin" aria-label="Painel — visão geral" className="rounded-xl px-1 py-1">
          <Logo withName />
        </Link>
        <SidebarNav />
        <p className="mt-auto px-3 font-mono text-[0.6875rem] text-subtle">painel administrativo</p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border glass px-4 sm:px-6">
          <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
            <Dialog.Trigger
              aria-label="Abrir menu do painel"
              className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-hover lg:hidden"
            >
              <Menu aria-hidden="true" className="size-5" />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-fade-in lg:hidden" />
              <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col gap-6 overflow-y-auto border-r border-border-strong bg-background-alt p-4 shadow-float focus:outline-none data-[state=open]:animate-fade-in lg:hidden">
                <div className="flex items-center justify-between">
                  <Logo withName />
                  <Dialog.Close
                    aria-label="Fechar menu do painel"
                    className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-hover"
                  >
                    <X aria-hidden="true" className="size-5" />
                  </Dialog.Close>
                </div>
                <Dialog.Title className="sr-only">Menu do painel</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Navegue pelas seções do painel administrativo.
                </Dialog.Description>
                <SidebarNav onNavigate={() => setDrawerOpen(false)} />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <span className="hidden min-w-0 truncate text-sm text-muted sm:block">{email}</span>

          <div className="ml-auto flex items-center gap-1">
            <Button asChild variant="ghost" size="sm">
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLinkIcon aria-hidden="true" />
                Ver site
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </Button>
            <ThemeToggle />
            <Button variant="secondary" size="sm" onClick={() => void signOut()}>
              <LogOut aria-hidden="true" />
              Sair
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
