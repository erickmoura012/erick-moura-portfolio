import { ArrowUp, ArrowUpRight, SquareTerminal } from 'lucide-react'
import { Link } from 'react-router'
import { useUiState } from '@/app/providers/ui-state'
import { NAV_SECTIONS, SECTION_IDS } from '@/app/sections'
import { GithubIcon, LinkedinIcon } from '@/components/common/BrandIcons'
import { ExternalLink } from '@/components/common/ExternalLink'
import { usePortfolioContent } from '@/hooks/use-portfolio-content'
import { useMessages } from '@/i18n'

export function Footer() {
  const t = useMessages()
  const { profile } = usePortfolioContent()
  const { setTerminalOpen } = useUiState()
  const linkClass = 'text-sm text-muted transition-colors hover:text-foreground'

  return (
    <footer className="border-t border-border">
      <div className="container-page frame-x">
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col items-start gap-5">
            <p className="max-w-sm font-display text-2xl leading-snug font-semibold text-foreground">
              {t.footer.tagline}
            </p>
            <Link
              to={{ pathname: '/', hash: `#${SECTION_IDS.contact}` }}
              className="group inline-flex h-11 items-center gap-2 text-sm font-medium text-foreground underline decoration-border-strong underline-offset-[6px] transition-colors hover:decoration-electric"
            >
              {t.nav.cta}
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <button
              type="button"
              onClick={() => setTerminalOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 font-mono text-xs text-muted transition-colors hover:border-border-strong hover:text-foreground"
            >
              <SquareTerminal aria-hidden="true" className="size-3.5" />
              {t.footer.openTerminal}
            </button>
          </div>

          <nav aria-label={t.footer.navTitle}>
            <h2 className="mb-4 label-mono font-normal text-subtle">{t.footer.navTitle}</h2>
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
            <h2 className="mb-4 label-mono font-normal text-subtle">{t.footer.socialTitle}</h2>
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

        {/* Assinatura em tamanho de cartaz; decorativa, o nome já está no cabeçalho. */}
        <p
          aria-hidden="true"
          className="overflow-hidden border-t border-border pt-6 pb-4 font-display text-[clamp(2.5rem,14vw,11.5rem)] leading-[0.82] font-semibold tracking-[-0.055em] whitespace-nowrap text-foreground select-none"
        >
          {profile.name}
          <span className="text-electric">.</span>
        </p>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-border py-5 sm:flex-row sm:items-center">
          <p className="text-xs text-subtle">
            <span suppressHydrationWarning>{t.footer.rights(new Date().getFullYear())}</span>{' '}
            {t.footer.builtWith}
          </p>
          <a
            href="#conteudo"
            className="inline-flex h-9 items-center gap-1.5 text-xs text-muted transition-colors hover:text-foreground"
          >
            <ArrowUp aria-hidden="true" className="size-3.5" />
            {t.common.backToTop}
          </a>
        </div>
      </div>
    </footer>
  )
}
