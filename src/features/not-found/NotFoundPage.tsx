import { ArrowLeft } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { SECTION_IDS } from '@/app/sections'
import { Button } from '@/components/ui/button'
import { usePageMeta } from '@/hooks/use-page-meta'
import { useMessages } from '@/i18n'

/** Página 404 no estilo de uma saída de terminal. */
export function NotFoundPage() {
  const t = useMessages()
  const { pathname } = useLocation()
  usePageMeta(t.meta.notFoundTitle)

  return (
    <div className="container-page flex min-h-dvh flex-col items-center justify-center py-28">
      <div className="w-full max-w-2xl">
        <div className="overflow-hidden rounded-2xl border border-border-strong bg-background-alt/85 shadow-float">
          <div
            aria-hidden="true"
            className="flex items-center gap-1.5 border-b border-border px-4 py-3"
          >
            <span className="size-2.5 rounded-full bg-[#f87171]/80" />
            <span className="size-2.5 rounded-full bg-[#fbbf24]/80" />
            <span className="size-2.5 rounded-full bg-[#34d399]/80" />
            <span className="ml-3 font-mono text-xs text-subtle">router.log</span>
          </div>
          <div className="px-5 py-6 font-mono text-sm leading-7 sm:px-6">
            <p className="break-all text-muted">
              <span aria-hidden="true" className="text-cyan">
                ${' '}
              </span>
              {t.notFound.logCommand} {pathname}
            </p>
            <p className="break-all text-danger">{t.notFound.logError(pathname)}</p>
            <p className="text-subtle">{t.notFound.logHint}</p>
            <p aria-hidden="true" className="text-muted">
              <span className="text-cyan">$ </span>
              <span className="inline-block h-4 w-2 translate-y-0.5 animate-caret bg-cyan" />
            </p>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-gradient font-display text-7xl font-semibold sm:text-8xl">
            {t.notFound.code}
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
            {t.notFound.title}
          </h1>
          <p className="mt-3 text-muted">{t.notFound.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/">
                <ArrowLeft aria-hidden="true" />
                {t.notFound.home}
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to={{ pathname: '/', hash: `#${SECTION_IDS.projects}` }}>
                {t.notFound.projects}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
