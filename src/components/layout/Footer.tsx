import { ArrowUp, SquareTerminal } from 'lucide-react'
import { Link } from 'react-router'
import { useUiState } from '@/app/providers/ui-state'
import { NAV_SECTIONS, SECTION_IDS } from '@/app/sections'
import { GithubIcon, LinkedinIcon } from '@/components/common/BrandIcons'
import { ExternalLink } from '@/components/common/ExternalLink'
import { Logo } from '@/components/common/Logo'
import { usePortfolioContent } from '@/hooks/use-portfolio-content'
import { useMessages } from '@/i18n'

export function Footer() {
  const t = useMessages()
  const { profile } = usePortfolioContent()
  const { setTerminalOpen } = useUiState()
  const linkClass = 'text-muted hover:text-foreground text-sm transition-colors'

  return (
    <footer className="mt-12 border-t border-border bg-background-alt/40">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col items-start gap-4">
          <Logo withName />
          <p className="max-w-xs text-sm leading-relaxed text-muted">{t.footer.tagline}</p>
          <button
            type="button"
            onClick={() => setTerminalOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-border px-3.5 font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-foreground"
          >
            <SquareTerminal aria-hidden="true" className="size-3.5" />
            {t.footer.openTerminal}
          </button>
        </div>

        <nav aria-label={t.footer.navTitle}>
          <h2 className="mb-4 font-mono text-xs tracking-wider text-subtle uppercase">
            {t.footer.navTitle}
          </h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {NAV_SECTIONS.map((key) => (
              <li key={key}>
                <Link to={{ pathname: '/', hash: `#${SECTION_IDS[key]}` }} className={linkClass}>
                  {t.nav.items[key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 font-mono text-xs tracking-wider text-subtle uppercase">
            {t.footer.socialTitle}
          </h2>
          <ul className="flex flex-col gap-2.5">
            <li>
              <ExternalLink
                href={profile.githubUrl}
                className={`${linkClass} inline-flex items-center gap-2`}
              >
                <GithubIcon className="size-4" />
                GitHub
              </ExternalLink>
            </li>
            <li>
              <ExternalLink
                href={profile.linkedinUrl}
                className={`${linkClass} inline-flex items-center gap-2`}
              >
                <LinkedinIcon className="size-4" />
                LinkedIn
              </ExternalLink>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-start justify-between gap-3 py-5 sm:flex-row sm:items-center">
          <p className="text-xs text-subtle">
            <span suppressHydrationWarning>{t.footer.rights(new Date().getFullYear())}</span>{' '}
            {t.footer.builtWith}
          </p>
          <a
            href="#conteudo"
            className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-foreground"
          >
            <ArrowUp aria-hidden="true" className="size-3.5" />
            {t.common.backToTop}
          </a>
        </div>
      </div>
    </footer>
  )
}
