import { Outlet } from 'react-router'
import { ScrollManager } from '@/app/router/ScrollManager'
import { useMessages } from '@/i18n'
import { Footer } from './Footer'
import { GlobalOverlays } from './GlobalOverlays'
import { Navbar } from './Navbar'

export function SiteLayout() {
  const t = useMessages()

  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      <a
        href="#conteudo"
        className="sr-only z-[60] rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        {t.common.skipToContent}
      </a>
      <ScrollManager />
      <Navbar />
      <main id="conteudo" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
      <GlobalOverlays />
    </div>
  )
}
