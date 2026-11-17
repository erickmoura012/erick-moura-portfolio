import { Search } from 'lucide-react'
import { m } from 'motion/react'
import { Link, useLocation } from 'react-router'
import { useUiState } from '@/app/providers/ui-state'
import { NAV_SECTIONS, SECTION_IDS, type NavSectionKey } from '@/app/sections'
import { Logo } from '@/components/common/Logo'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Button } from '@/components/ui/button'
import { useActiveSection } from '@/hooks/use-active-section'
import { useMessages } from '@/i18n'
import { cn } from '@/lib/utils'
import { MobileMenu } from './MobileMenu'

const NAV_IDS = NAV_SECTIONS.map((key) => SECTION_IDS[key])

/** Seção ativa: observa o scroll na home; nas páginas de projeto, destaca "Projetos". */
function useActiveNavSection(): NavSectionKey | null {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const activeId = useActiveSection(NAV_IDS, isHome)

  if (!isHome) return pathname.startsWith('/projetos') ? 'projects' : null
  return NAV_SECTIONS.find((key) => SECTION_IDS[key] === activeId) ?? null
}

export function Navbar() {
  const t = useMessages()
  const active = useActiveNavSection()
  const { setCommandPaletteOpen } = useUiState()

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="pointer-events-auto mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 rounded-full border border-border glass pr-2 pl-3 shadow-card sm:h-16 sm:pr-3 sm:pl-4">
        <Link
          to={{ pathname: '/', hash: `#${SECTION_IDS.home}` }}
          aria-label={t.nav.homeLink}
          className="rounded-full"
        >
          <Logo />
        </Link>

        <nav aria-label={t.nav.label} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_SECTIONS.map((key) => {
              const isActive = active === key
              return (
                <li key={key}>
                  <Link
                    to={{ pathname: '/', hash: `#${SECTION_IDS[key]}` }}
                    aria-current={isActive ? 'location' : undefined}
                    className={cn(
                      'relative inline-flex h-10 items-center rounded-full px-3.5 text-sm font-medium transition-colors',
                      isActive ? 'text-foreground' : 'text-muted hover:text-foreground',
                    )}
                  >
                    {isActive ? (
                      <m.span
                        layoutId="nav-active-pill"
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full border border-border-strong bg-surface-hover/80"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    <span className="relative">{t.nav.items[key]}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            aria-keyshortcuts="Control+K Meta+K"
            className="inline-flex h-10 items-center gap-2 rounded-full px-2.5 text-sm text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <Search aria-hidden="true" className="size-[1.125rem]" />
            <span className="sr-only">{t.nav.search}</span>
            <kbd
              aria-hidden="true"
              className="hidden rounded-md border border-border px-1.5 py-0.5 font-mono text-[0.6875rem] text-subtle xl:inline"
            >
              Ctrl K
            </kbd>
          </button>
          <ThemeToggle />
          <Button asChild size="sm" className="ml-1 hidden h-10 sm:inline-flex">
            <Link to={{ pathname: '/', hash: `#${SECTION_IDS.contact}` }}>{t.nav.cta}</Link>
          </Button>
          <MobileMenu active={active} />
        </div>
      </div>
    </header>
  )
}
