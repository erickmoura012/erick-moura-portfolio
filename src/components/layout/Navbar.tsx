import { ArrowUpRight, Search } from 'lucide-react'
import { m } from 'motion/react'
import { Link, useLocation } from 'react-router'
import { useUiState } from '@/app/providers/ui-state'
import { NAV_SECTIONS, SECTION_IDS, type NavSectionKey } from '@/app/sections'
import { Logo } from '@/components/common/Logo'
import { ThemeToggle } from '@/components/common/ThemeToggle'
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
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/92 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4 frame-x">
        <Link
          to={{ pathname: '/', hash: `#${SECTION_IDS.home}` }}
          className="flex shrink-0 items-center gap-3 rounded-md"
        >
          <Logo />
          <span className="sr-only leading-tight sm:not-sr-only sm:block">
            <span className="block font-display text-[0.9375rem] font-semibold text-foreground">
              Erick Moura
            </span>{' '}
            <span className="block label-mono text-[0.625rem] text-subtle">Full Stack · IA</span>
            <span className="sr-only"> — {t.nav.homeLinkSuffix}</span>
          </span>
        </Link>

        <nav aria-label={t.nav.label} className="hidden h-full lg:block">
          <ul className="flex h-full items-stretch">
            {NAV_SECTIONS.map((key) => {
              const isActive = active === key
              return (
                <li key={key} className="flex">
                  <Link
                    to={{ pathname: '/', hash: `#${SECTION_IDS[key]}` }}
                    aria-current={isActive ? 'location' : undefined}
                    className={cn(
                      'relative flex items-center px-3 text-sm font-medium transition-colors xl:px-4',
                      isActive ? 'text-foreground' : 'text-foreground/70 hover:text-foreground',
                    )}
                  >
                    {t.nav.items[key]}
                    {isActive ? (
                      <m.span
                        layoutId="nav-active-bar"
                        aria-hidden="true"
                        className="absolute inset-x-3 -bottom-px h-0.5 bg-electric xl:inset-x-4"
                        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                      />
                    ) : null}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            aria-keyshortcuts="Control+K Meta+K"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-3 text-sm text-foreground/80 transition-colors hover:border-border-strong hover:text-foreground"
          >
            <Search aria-hidden="true" className="size-4" />
            <span className="sr-only xl:not-sr-only">Buscar</span>
            <span className="sr-only"> e navegar</span>
            <kbd
              aria-hidden="true"
              className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[0.625rem] text-subtle 2xl:inline"
            >
              Ctrl K
            </kbd>
          </button>
          <ThemeToggle />
          <Link
            to={{ pathname: '/', hash: `#${SECTION_IDS.contact}` }}
            className="ml-1 hidden h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover sm:inline-flex"
          >
            {t.nav.cta}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
          <MobileMenu active={active} />
        </div>
      </div>
    </header>
  )
}
