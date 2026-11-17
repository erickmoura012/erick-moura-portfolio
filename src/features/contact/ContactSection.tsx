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
      <Skeleton className="ml-auto h-12 w-44 rounded-md" />
    </div>
  )
}

const channelClass =
  'group flex items-center gap-4 px-5 py-5 transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover'

function ChannelBody({ icon, title, hint }: { icon: ReactNode; title: string; hint: string }) {
  return (
    <>
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-border text-foreground transition-colors group-hover:border-electric group-hover:text-electric [&_svg]:size-[1.125rem]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-lg font-semibold text-foreground">{title}</span>
        <span className="block text-sm break-words text-muted">{hint}</span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-5 shrink-0 text-subtle transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-electric"
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
      highlight={t.contact.titleHighlight}
      description={t.contact.description}
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
        <Reveal>
          <h3 className="mb-4 label-mono text-subtle">{t.contact.channelsTitle}</h3>
          <ul className="divide-y divide-border overflow-hidden rounded-card border border-border">
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
                <span className="inline-flex size-12 items-center justify-center rounded-md border border-warning/30 bg-warning/10 text-warning">
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
