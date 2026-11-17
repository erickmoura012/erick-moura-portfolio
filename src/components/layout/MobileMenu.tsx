import { ArrowUpRight, Menu, X } from 'lucide-react'
import { m } from 'motion/react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { useState } from 'react'
import { Link } from 'react-router'
import { INDEX_SECTIONS, SECTION_IDS, sectionNumber, type NavSectionKey } from '@/app/sections'
import { EASE_OUT } from '@/components/animations/easing'
import { GithubIcon, LinkedinIcon } from '@/components/common/BrandIcons'
import { ExternalLink } from '@/components/common/ExternalLink'
import { Logo } from '@/components/common/Logo'
import { usePortfolioContent } from '@/hooks/use-portfolio-content'
import { useMessages } from '@/i18n'
import { cn } from '@/lib/utils'

export function MobileMenu({ active }: { active: NavSectionKey | null }) {
  const t = useMessages()
  const { profile } = usePortfolioContent()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger
        aria-label={t.nav.openMenu}
        className="inline-flex h-10 items-center gap-2 rounded-md border border-border-strong px-3 text-sm font-medium text-foreground transition-colors hover:border-foreground lg:hidden"
      >
        <Menu aria-hidden="true" className="size-4" />
        <span>Menu</span>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Content className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background focus:outline-none data-[state=open]:animate-fade-in lg:hidden">
          <div className="container-page flex h-16 shrink-0 items-center justify-between border-b border-border">
            <Logo withName />
            <DialogPrimitive.Close
              aria-label={t.nav.closeMenu}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border-strong px-3 text-sm font-medium text-foreground transition-colors hover:border-foreground"
            >
              <X aria-hidden="true" className="size-4" />
              <span>Fechar</span>
            </DialogPrimitive.Close>
          </div>
          <DialogPrimitive.Title className="sr-only">{t.nav.menuTitle}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {t.nav.menuDescription}
          </DialogPrimitive.Description>

          <nav aria-label={t.nav.label} className="container-page flex-1 py-4">
            <p aria-hidden="true" className="mb-2 label-mono text-subtle">
              Índice
            </p>
            <ul className="border-t border-border">
              {INDEX_SECTIONS.map((key, index) => (
                <m.li
                  key={key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.035 * index, ease: EASE_OUT }}
                  className="border-b border-border"
                >
                  <Link
                    to={{ pathname: '/', hash: `#${SECTION_IDS[key]}` }}
                    onClick={close}
                    aria-current={active === key ? 'location' : undefined}
                    className={cn(
                      'flex h-16 items-center gap-4 font-display text-2xl font-medium transition-colors',
                      active === key
                        ? 'text-foreground'
                        : 'text-foreground/75 hover:text-foreground',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'w-7 font-mono text-xs',
                        active === key ? 'text-cyan' : 'text-subtle',
                      )}
                    >
                      {sectionNumber(key)}
                    </span>
                    <span className="flex-1">{t.sectionIndex.items[key].label}</span>
                    <ArrowUpRight aria-hidden="true" className="size-5 text-subtle" />
                  </Link>
                </m.li>
              ))}
            </ul>
          </nav>

          <div className="container-page flex shrink-0 items-center gap-2 border-t border-border py-4">
            <Link
              to={{ pathname: '/', hash: `#${SECTION_IDS.contact}` }}
              onClick={close}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground"
            >
              {t.nav.cta}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
            <ExternalLink
              href={profile.githubUrl}
              aria-label={t.hero.github}
              className="inline-flex size-11 items-center justify-center rounded-md border border-border-strong text-foreground [&_svg]:size-[1.125rem]"
            >
              <GithubIcon />
            </ExternalLink>
            <ExternalLink
              href={profile.linkedinUrl}
              aria-label={t.hero.linkedin}
              className="inline-flex size-11 items-center justify-center rounded-md border border-border-strong text-foreground [&_svg]:size-[1.125rem]"
            >
              <LinkedinIcon />
            </ExternalLink>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
