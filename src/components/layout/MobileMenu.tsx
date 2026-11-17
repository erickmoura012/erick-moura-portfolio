import { Menu, X } from 'lucide-react'
import { m } from 'motion/react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { useState } from 'react'
import { Link } from 'react-router'
import { NAV_SECTIONS, SECTION_IDS, type NavSectionKey } from '@/app/sections'
import { EASE_OUT } from '@/components/animations/easing'
import { GithubIcon, LinkedinIcon } from '@/components/common/BrandIcons'
import { ExternalLink } from '@/components/common/ExternalLink'
import { Logo } from '@/components/common/Logo'
import { Button } from '@/components/ui/button'
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
        className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-hover lg:hidden"
      >
        <Menu aria-hidden="true" className="size-5" />
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-fade-in lg:hidden" />
        <DialogPrimitive.Content className="fixed inset-x-3 top-3 z-50 flex max-h-[calc(100dvh-1.5rem)] flex-col overflow-y-auto rounded-3xl border border-border-strong glass p-4 shadow-float focus:outline-none data-[state=open]:animate-fade-in lg:hidden">
          <div className="flex items-center justify-between">
            <Logo withName />
            <DialogPrimitive.Close
              aria-label={t.nav.closeMenu}
              className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-hover"
            >
              <X aria-hidden="true" className="size-5" />
            </DialogPrimitive.Close>
          </div>
          <DialogPrimitive.Title className="sr-only">{t.nav.menuTitle}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {t.nav.menuDescription}
          </DialogPrimitive.Description>

          <nav aria-label={t.nav.label} className="mt-4">
            <ul className="flex flex-col">
              {NAV_SECTIONS.map((key, index) => (
                <m.li
                  key={key}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.04 * index, ease: EASE_OUT }}
                >
                  <Link
                    to={{ pathname: '/', hash: `#${SECTION_IDS[key]}` }}
                    onClick={close}
                    aria-current={active === key ? 'location' : undefined}
                    className={cn(
                      'flex h-13 items-center justify-between rounded-2xl px-4 font-display text-xl font-medium transition-colors',
                      active === key
                        ? 'bg-surface-hover/80 text-foreground'
                        : 'text-muted hover:text-foreground',
                    )}
                  >
                    {t.nav.items[key]}
                    <span aria-hidden="true" className="font-mono text-xs text-subtle">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </Link>
                </m.li>
              ))}
            </ul>
          </nav>

          <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
            <Button asChild className="flex-1">
              <Link to={{ pathname: '/', hash: `#${SECTION_IDS.contact}` }} onClick={close}>
                {t.nav.cta}
              </Link>
            </Button>
            <Button asChild variant="secondary" size="icon">
              <ExternalLink href={profile.githubUrl} aria-label={t.hero.github}>
                <GithubIcon />
              </ExternalLink>
            </Button>
            <Button asChild variant="secondary" size="icon">
              <ExternalLink href={profile.linkedinUrl} aria-label={t.hero.linkedin}>
                <LinkedinIcon />
              </ExternalLink>
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
