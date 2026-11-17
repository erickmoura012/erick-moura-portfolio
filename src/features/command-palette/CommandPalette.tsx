import { Command } from 'cmdk'
import {
  ArrowRight,
  FolderGit2,
  Mail,
  Search,
  SquareTerminal,
  SunMoon,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { useUiState } from '@/app/providers/ui-state'
import { NAV_SECTIONS, SECTION_IDS } from '@/app/sections'
import { GithubIcon, LinkedinIcon } from '@/components/common/BrandIcons'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { selectProjectRepos } from '@/features/github/selectors'
import { useGithubData } from '@/features/github/use-github-data'
import { useFeaturedProjects, usePortfolioContent } from '@/hooks/use-portfolio-content'
import { toggleTheme } from '@/hooks/use-theme'
import { useMessages } from '@/i18n'

const groupClass =
  '[&_[cmdk-group-heading]]:text-subtle px-2 py-1.5 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.6875rem] [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:uppercase'

const itemClass =
  'text-muted data-[selected=true]:bg-surface-hover data-[selected=true]:text-foreground flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm [&_svg]:size-4 [&_svg]:shrink-0'

interface PaletteItemProps {
  icon: ReactNode
  label: string
  hint?: string
  keywords?: string[]
  onSelect: () => void
}

function PaletteItem({ icon, label, hint, keywords, onSelect }: PaletteItemProps) {
  return (
    <Command.Item value={label} keywords={keywords} onSelect={onSelect} className={itemClass}>
      {icon}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {hint ? <span className="hidden truncate text-xs text-subtle sm:inline">{hint}</span> : null}
    </Command.Item>
  )
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded-md border border-border px-1.5 py-0.5 font-mono text-[0.6875rem]">
      {children}
    </kbd>
  )
}

const SECTION_ICON: LucideIcon = ArrowRight

export function CommandPalette() {
  const t = useMessages()
  const navigate = useNavigate()
  const { setCommandPaletteOpen, setTerminalOpen } = useUiState()
  const { profile } = usePortfolioContent()
  const { all: featured } = useFeaturedProjects()
  const { result } = useGithubData()

  const featuredRepoNames = new Set(
    featured.flatMap((project) => (project.repoName ? [project.repoName.toLowerCase()] : [])),
  )
  const otherRepos = result
    ? selectProjectRepos(result.data).filter(
        (repo) => !featuredRepoNames.has(repo.name.toLowerCase()),
      )
    : []

  const close = () => setCommandPaletteOpen(false)
  const run = (action: () => void) => () => {
    close()
    action()
  }
  const openExternal = (url: string) => () => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Dialog open onOpenChange={setCommandPaletteOpen}>
      <DialogContent hideClose className="top-[12vh] max-w-xl translate-y-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">{t.commandPalette.title}</DialogTitle>
        <DialogDescription className="sr-only">{t.commandPalette.description}</DialogDescription>

        <Command label={t.commandPalette.title} loop>
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search aria-hidden="true" className="size-4 shrink-0 text-subtle" />
            <Command.Input
              autoFocus
              placeholder={t.commandPalette.placeholder}
              className="h-14 w-full bg-transparent text-sm text-foreground placeholder:text-subtle focus:outline-none"
            />
          </div>

          <Command.List className="max-h-[min(24rem,55dvh)] scrollbar-thin overflow-y-auto py-1">
            <Command.Empty className="px-4 py-10 text-center text-sm text-muted">
              {t.commandPalette.empty}
            </Command.Empty>

            <Command.Group heading={t.commandPalette.groups.navigation} className={groupClass}>
              {NAV_SECTIONS.map((key) => (
                <PaletteItem
                  key={key}
                  icon={<SECTION_ICON aria-hidden="true" />}
                  label={t.nav.items[key]}
                  onSelect={run(
                    () => void navigate({ pathname: '/', hash: `#${SECTION_IDS[key]}` }),
                  )}
                />
              ))}
            </Command.Group>

            <Command.Group heading={t.commandPalette.groups.projects} className={groupClass}>
              {featured.map((project) => (
                <PaletteItem
                  key={project.id}
                  icon={<FolderGit2 aria-hidden="true" />}
                  label={project.title}
                  hint={project.tagline}
                  keywords={[project.tagline, ...project.stack]}
                  onSelect={run(() => void navigate(`/projetos/${project.slug}`))}
                />
              ))}
              {otherRepos.map((repo) => (
                <PaletteItem
                  key={repo.id}
                  icon={<GithubIcon />}
                  label={repo.name}
                  hint={repo.description ?? undefined}
                  keywords={[repo.language ?? '', ...repo.topics]}
                  onSelect={run(openExternal(repo.htmlUrl))}
                />
              ))}
            </Command.Group>

            <Command.Group heading={t.commandPalette.groups.actions} className={groupClass}>
              <PaletteItem
                icon={<SunMoon aria-hidden="true" />}
                label={t.commandPalette.actions.toggleTheme}
                keywords={['dark', 'light', 'claro', 'escuro']}
                onSelect={run(toggleTheme)}
              />
              <PaletteItem
                icon={<SquareTerminal aria-hidden="true" />}
                label={t.commandPalette.actions.openTerminal}
                keywords={['terminal', 'cli']}
                onSelect={run(() => setTerminalOpen(true))}
              />
              <PaletteItem
                icon={<Mail aria-hidden="true" />}
                label={t.commandPalette.actions.contact}
                keywords={['contato', 'mensagem', 'email']}
                onSelect={run(
                  () => void navigate({ pathname: '/', hash: `#${SECTION_IDS.contact}` }),
                )}
              />
            </Command.Group>

            <Command.Group heading={t.commandPalette.groups.links} className={groupClass}>
              <PaletteItem
                icon={<GithubIcon />}
                label={t.commandPalette.actions.openGithub}
                onSelect={run(openExternal(profile.githubUrl))}
              />
              <PaletteItem
                icon={<LinkedinIcon />}
                label={t.commandPalette.actions.openLinkedin}
                onSelect={run(openExternal(profile.linkedinUrl))}
              />
            </Command.Group>
          </Command.List>

          <div
            aria-hidden="true"
            className="hidden items-center gap-4 border-t border-border px-4 py-2.5 text-xs text-subtle sm:flex"
          >
            <span className="inline-flex items-center gap-1.5">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              {t.commandPalette.hintNavigate}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Kbd>Enter</Kbd>
              {t.commandPalette.hintSelect}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Kbd>Esc</Kbd>
              {t.commandPalette.hintClose}
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
