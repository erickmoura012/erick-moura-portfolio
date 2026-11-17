import { cn } from '@/lib/utils'
import type { Project, ProjectScreenshot } from '@/types/content'

/**
 * Capturas geradas por `npm run assets:screenshots` ficam em `/projects/` com
 * variantes AVIF e WebP de 640 e 1280 px. Imagens enviadas pelo painel são usadas como estão.
 */
function responsiveSources(src: string): { avif: string; webp: string } | null {
  if (!src.startsWith('/projects/') || !src.endsWith('.webp')) return null
  const base = src.slice(0, -'.webp'.length)
  const set = (ext: string) => `${base}-640.${ext} 640w, ${base}.${ext} 1280w`
  return { avif: set('avif'), webp: set('webp') }
}

interface ScreenshotProps {
  screenshot: ProjectScreenshot
  /** Imagens acima da dobra devem carregar com prioridade. */
  priority?: boolean
  /** Largura exibida, para o navegador escolher a variante certa. */
  sizes?: string
  className?: string
}

export function Screenshot({
  screenshot,
  priority = false,
  sizes = '(min-width: 1024px) 560px, calc(100vw - 2.5rem)',
  className,
}: ScreenshotProps) {
  const sources = responsiveSources(screenshot.src)
  return (
    <picture>
      {sources ? <source srcSet={sources.avif} sizes={sizes} type="image/avif" /> : null}
      <img
        src={screenshot.src}
        srcSet={sources?.webp}
        sizes={sources ? sizes : undefined}
        alt={screenshot.alt}
        width={1280}
        height={800}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={cn('aspect-[16/10] w-full object-cover object-top', className)}
      />
    </picture>
  )
}

function BrowserFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-strong bg-background-alt shadow-float">
      <div className="flex items-center gap-3 border-b border-border px-3.5 py-2.5">
        <div aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
        </div>
        <span className="min-w-0 flex-1 truncate rounded-md border border-border bg-surface/70 px-2.5 py-1 font-mono text-[0.6875rem] text-subtle">
          {label}
        </span>
      </div>
      {children}
    </div>
  )
}

/**
 * Visual do projeto: a captura real da aplicação quando existe; caso contrário,
 * a própria arquitetura do projeto apresentada como um painel de código.
 */
export function ProjectVisual({ project, priority }: { project: Project; priority?: boolean }) {
  const screenshot = project.screenshots[0]
  const label = (project.demoUrl ?? project.repoUrl ?? project.title).replace(/^https?:\/\//, '')

  if (screenshot) {
    return (
      <BrowserFrame label={label}>
        <Screenshot screenshot={screenshot} priority={priority} />
      </BrowserFrame>
    )
  }

  return (
    <BrowserFrame label={label}>
      <ul className="flex flex-col gap-3 p-5 font-mono text-xs leading-relaxed sm:text-[0.8125rem]">
        {project.architecture.map((line, index) => (
          <li key={line} className="flex gap-3">
            <span aria-hidden="true" className="w-4 shrink-0 text-right text-subtle select-none">
              {index + 1}
            </span>
            <span className="text-muted">{line}</span>
          </li>
        ))}
      </ul>
    </BrowserFrame>
  )
}
