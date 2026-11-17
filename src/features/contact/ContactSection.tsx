import { ArrowUpRight, Mail, Wrench } from 'lucide-react'
import { lazy, Suspense, type ReactNode } from 'react'
import { SECTION_IDS } from '@/app/sections'
import { Reveal } from '@/components/animations/Reveal'
import { GithubIcon, LinkedinIcon } from '@/components/common/BrandIcons'
import { ExternalLink } from '@/components/common/ExternalLink'
import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePortfolioContent } from '@/hooks/use-portfolio-content'
import { useMessages } from '@/i18n'
import { isSupabaseConfigured } from '@/lib/env'

// Zod e React Hook Form só são baixados quando o formulário é realmente exibido.
const ContactForm = lazy(() =>
  import('./ContactForm').then((module) => ({ default: module.ContactForm })),
)

function ContactFormFallback() {
  return (
    <div aria-hidden="true" className="flex min-h-[29rem] flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Skeleton className="h-[4.25rem]" />
        <Skeleton className="h-[4.25rem]" />
      </div>
      <Skeleton className="h-[4.25rem]" />
      <Skeleton className="h-44" />
      <Skeleton className="ml-auto h-12 w-44 rounded-full" />
    </div>
  )
}

const channelClass =
  'spotlight group border-border bg-surface/60 hover:border-border-strong flex items-center gap-4 rounded-2xl border p-4 transition-colors'

function ChannelBody({ icon, title, hint }: { icon: ReactNode; title: string; hint: string }) {
  return (
    <>
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background-alt text-accent [&_svg]:size-5">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-foreground">{title}</span>
        <span className="block truncate text-sm text-muted">{hint}</span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 shrink-0 text-subtle transition-colors group-hover:text-foreground"
      />
    </>
  )
}

export function ContactSection() {
  const t = useMessages()
  const { profile } = usePortfolioContent()

  return (
    <Section
      id={SECTION_IDS.contact}
      index={8}
      eyebrow={t.contact.eyebrow}
      title={t.contact.title}
      description={t.contact.description}
    >
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
        <Reveal>
          <h3 className="mb-5 font-mono text-xs tracking-wider text-subtle uppercase">
            {t.contact.channelsTitle}
          </h3>
          <ul className="flex flex-col gap-3">
            <li>
              <ExternalLink href={profile.linkedinUrl} className={channelClass}>
                <ChannelBody
                  icon={<LinkedinIcon />}
                  title={t.contact.channels.linkedin}
                  hint={t.contact.channels.linkedinHint}
                />
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={profile.githubUrl} className={channelClass}>
                <ChannelBody
                  icon={<GithubIcon />}
                  title={t.contact.channels.github}
                  hint={t.contact.channels.githubHint}
                />
              </ExternalLink>
            </li>
            {profile.publicEmail ? (
              <li>
                <a href={`mailto:${profile.publicEmail}`} className={channelClass}>
                  <ChannelBody
                    icon={<Mail aria-hidden="true" />}
                    title={t.contact.channels.email}
                    hint={profile.publicEmail}
                  />
                </a>
              </li>
            ) : null}
          </ul>
        </Reveal>

        <Reveal delay={0.08}>
          <Card className="p-6 sm:p-8">
            {isSupabaseConfigured ? (
              <Suspense fallback={<ContactFormFallback />}>
                <ContactForm />
              </Suspense>
            ) : (
              <div className="flex min-h-64 flex-col items-start justify-center gap-4">
                <span className="inline-flex size-12 items-center justify-center rounded-xl border border-warning/30 bg-warning/10 text-warning">
                  <Wrench aria-hidden="true" className="size-5" />
                </span>
                <h3 className="text-xl font-semibold text-foreground">
                  {t.contact.unavailableTitle}
                </h3>
                <p className="max-w-md leading-relaxed text-muted">
                  {t.contact.unavailableDescription}
                </p>
                <Button asChild className="mt-1">
                  <ExternalLink href={profile.linkedinUrl}>
                    <LinkedinIcon />
                    {t.contact.channels.linkedin}
                  </ExternalLink>
                </Button>
              </div>
            )}
          </Card>
        </Reveal>
      </div>
    </Section>
  )
}
