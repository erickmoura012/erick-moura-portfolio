import { ArrowRight, Download, Mail } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { SECTION_IDS } from '@/app/sections'
import { RotatingText } from '@/components/animations/RotatingText'
import { GithubIcon, LinkedinIcon } from '@/components/common/BrandIcons'
import { ExternalLink } from '@/components/common/ExternalLink'
import { Button } from '@/components/ui/button'
import { usePortfolioContent } from '@/hooks/use-portfolio-content'
import { useMessages } from '@/i18n'
import { HeroVisual } from './HeroVisual'

/**
 * As entradas usam animação CSS (e não estado inicial via JavaScript) para que o
 * conteúdo acima da dobra apareça no primeiro paint do HTML pré-renderizado.
 */
const rise = (delayMs: number): CSSProperties => ({ animationDelay: `${delayMs}ms` })

export function Hero() {
  const t = useMessages()
  const { profile } = usePortfolioContent()
  const socialClass =
    'border-border text-muted hover:border-accent/60 hover:text-foreground inline-flex size-11 items-center justify-center rounded-full border transition-colors [&_svg]:size-[1.125rem]'

  return (
    <section
      id={SECTION_IDS.home}
      aria-labelledby="hero-titulo"
      className="relative scroll-mt-24 overflow-x-clip"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid" />

      <div className="container-page grid items-center gap-14 pt-28 pb-16 sm:pt-36 lg:min-h-[min(100dvh,56rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pt-32 lg:pb-24">
        <div className="flex min-w-0 flex-col items-start">
          <p
            className="mb-7 inline-flex max-w-full animate-rise items-center gap-2.5 rounded-full border border-border bg-surface/60 py-1.5 pr-4 pl-3 text-xs text-muted sm:text-sm"
            style={rise(0)}
          >
            <span aria-hidden="true" className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            <span className="truncate">
              <span className="text-subtle">{t.hero.statusLabel}: </span>
              {t.hero.status}
            </span>
          </p>

          <h1 id="hero-titulo" className="text-foreground">
            <span className="mb-3 block font-mono text-sm font-normal tracking-normal text-cyan sm:text-base">
              {t.hero.greeting}
            </span>
            <span className="block text-5xl leading-[1.05] font-semibold sm:text-6xl lg:text-7xl">
              {profile.name}
            </span>
          </h1>

          <p
            className="mt-4 animate-rise font-display text-2xl font-medium sm:text-3xl"
            style={rise(120)}
          >
            <RotatingText
              items={profile.roles}
              label={t.hero.rolesLabel}
              className="text-gradient"
            />
          </p>

          {/* Elemento de LCP: aparece já no primeiro paint, sem fade. */}
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {profile.tagline}
          </p>

          <div className="mt-9 flex animate-rise flex-wrap items-center gap-3" style={rise(280)}>
            <Button asChild size="lg">
              <Link to={{ pathname: '/', hash: `#${SECTION_IDS.projects}` }}>
                {t.hero.ctaProjects}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to={{ pathname: '/', hash: `#${SECTION_IDS.contact}` }}>
                {t.hero.ctaContact}
              </Link>
            </Button>
            {profile.resumeUrl ? (
              <Button asChild size="lg" variant="ghost">
                <a href={profile.resumeUrl} download target="_blank" rel="noopener noreferrer">
                  <Download aria-hidden="true" />
                  {t.hero.ctaResume}
                </a>
              </Button>
            ) : null}
          </div>

          <ul
            aria-label={t.hero.socialLabel}
            className="mt-9 flex animate-rise items-center gap-2.5"
            style={rise(360)}
          >
            <li>
              <ExternalLink
                href={profile.githubUrl}
                aria-label={t.hero.github}
                className={socialClass}
              >
                <GithubIcon />
              </ExternalLink>
            </li>
            <li>
              <ExternalLink
                href={profile.linkedinUrl}
                aria-label={t.hero.linkedin}
                className={socialClass}
              >
                <LinkedinIcon />
              </ExternalLink>
            </li>
            {profile.publicEmail ? (
              <li>
                <a
                  href={`mailto:${profile.publicEmail}`}
                  aria-label={t.hero.email}
                  className={socialClass}
                >
                  <Mail aria-hidden="true" />
                </a>
              </li>
            ) : null}
          </ul>
        </div>

        <HeroVisual />
      </div>
    </section>
  )
}
