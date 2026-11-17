import { ArrowDownRight, ArrowUpRight, Download, Mail } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { SECTION_IDS } from '@/app/sections'
import { RotatingText } from '@/components/animations/RotatingText'
import { GithubIcon, LinkedinIcon } from '@/components/common/BrandIcons'
import { ExternalLink } from '@/components/common/ExternalLink'
import { Button } from '@/components/ui/button'
import { usePortfolioContent } from '@/hooks/use-portfolio-content'
import { useMessages } from '@/i18n'
import { HeroPortrait } from './HeroPortrait'
import { StackMarquee } from './StackMarquee'

/**
 * As entradas usam animação CSS (e não estado inicial via JavaScript) para que o
 * conteúdo acima da dobra apareça no primeiro paint do HTML pré-renderizado.
 */
const rise = (delayMs: number): CSSProperties => ({ animationDelay: `${delayMs}ms` })

export function Hero() {
  const t = useMessages()
  const { profile } = usePortfolioContent()
  const [firstName = profile.name, ...rest] = profile.name.split(' ')
  const lastName = rest.join(' ')
  const textLink =
    'inline-flex items-center gap-2 text-sm font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline [&_svg]:size-4'

  return (
    <section id={SECTION_IDS.home} aria-labelledby="hero-titulo" className="scroll-mt-20 pt-16">
      <div className="container-page frame-x">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-border py-3.5 label-mono text-subtle">
          <span>{t.hero.metaLeft}</span>
          <span className="flex items-center gap-2 tracking-normal normal-case">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-success" />
            <span className="text-muted">{t.hero.statusLabel}:</span>
            <span className="text-foreground">{t.hero.status}</span>
          </span>
          <span className="hidden md:inline">{t.hero.metaRight}</span>
        </div>

        <div className="grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16 lg:py-20">
          <div className="min-w-0">
            <h1 id="hero-titulo" className="text-foreground">
              <span className="mb-5 block label-mono text-cyan">{t.hero.greeting}</span>
              <span className="block font-display text-[clamp(3.4rem,11vw,7.25rem)] leading-[0.9] font-semibold tracking-[-0.045em]">
                <span className="block">{firstName}</span>{' '}
                <span className="block">
                  {lastName}
                  <span aria-hidden="true" className="text-electric">
                    .
                  </span>
                </span>
              </span>
            </h1>

            <p
              className="mt-8 flex animate-rise items-center gap-4 font-display text-xl font-medium sm:text-2xl"
              style={rise(80)}
            >
              <span aria-hidden="true" className="h-px w-10 shrink-0 bg-electric" />
              <RotatingText items={profile.roles} label={t.hero.rolesLabel} />
            </p>

            {/* Elemento de texto principal: aparece já no primeiro paint, sem fade. */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {profile.tagline}
            </p>

            <div className="mt-10 flex animate-rise flex-wrap items-center gap-3" style={rise(160)}>
              <Button asChild size="lg">
                <Link to={{ pathname: '/', hash: `#${SECTION_IDS.projects}` }}>
                  {t.hero.ctaProjects}
                  <ArrowDownRight
                    aria-hidden="true"
                    className="transition-transform group-hover/button:translate-x-0.5 group-hover/button:translate-y-0.5"
                  />
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
              className="mt-10 flex animate-rise flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6"
              style={rise(240)}
            >
              <li>
                <ExternalLink
                  href={profile.githubUrl}
                  aria-label={t.hero.github}
                  className={textLink}
                >
                  <GithubIcon />
                  GitHub
                  <ArrowUpRight aria-hidden="true" className="text-subtle" />
                </ExternalLink>
              </li>
              <li>
                <ExternalLink
                  href={profile.linkedinUrl}
                  aria-label={t.hero.linkedin}
                  className={textLink}
                >
                  <LinkedinIcon />
                  LinkedIn
                  <ArrowUpRight aria-hidden="true" className="text-subtle" />
                </ExternalLink>
              </li>
              {profile.publicEmail ? (
                <li>
                  <a
                    href={`mailto:${profile.publicEmail}`}
                    aria-label={t.hero.email}
                    className={textLink}
                  >
                    <Mail aria-hidden="true" />
                    E-mail
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          <HeroPortrait />
        </div>
      </div>

      <StackMarquee />
    </section>
  )
}
