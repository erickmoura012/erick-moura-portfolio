import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import { StaticRouter } from 'react-router'
import { App } from './app/App'
import { staticContent } from './content'
import { DEFAULT_LOCALE, dictionaries } from './i18n'

export interface PrerenderRoute {
  /** Caminho público da rota. */
  path: string
  /** Arquivo gerado dentro de `dist/`. */
  file: string
  title: string
  description: string
  /** Rotas fora do sitemap (ex.: a página 404). */
  indexable: boolean
}

/** Rotas públicas geradas como HTML estático no build (ver `scripts/prerender.ts`). */
export function getPrerenderRoutes(): PrerenderRoute[] {
  const t = dictionaries[DEFAULT_LOCALE]
  const { projects } = staticContent[DEFAULT_LOCALE]

  return [
    {
      path: '/',
      file: 'index.html',
      title: t.meta.title,
      description: t.meta.description,
      indexable: true,
    },
    ...projects
      .filter((project) => project.featured)
      .map((project) => ({
        path: `/projetos/${project.slug}`,
        file: `projetos/${project.slug}.html`,
        title: t.meta.projectTitle(project.title),
        description: project.description,
        indexable: true,
      })),
    {
      path: '/404',
      file: '404.html',
      title: t.meta.notFoundTitle,
      description: t.notFound.description,
      indexable: false,
    },
  ]
}

/** Marcadores de um limite de Suspense emitido fora de ordem (exige script inline). */
const OUT_OF_ORDER_BOUNDARY = /<template id="B:\d+"|<div hidden id="S:\d+"/

/**
 * Renderiza uma rota para HTML estático completo e em ordem.
 * Por padrão o React "destaca" limites de Suspense maiores que ~12 kB para streaming
 * progressivo, posicionando-os depois com um script inline. Num HTML estático isso
 * só atrapalha: o conteúdo ficaria oculto sem JavaScript e o script seria bloqueado
 * pela CSP sem `unsafe-inline`. Por isso o limite é desativado.
 */
export async function render(path: string): Promise<string> {
  const { prelude } = await prerender(
    <StrictMode>
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    </StrictMode>,
    { progressiveChunkSize: Number.MAX_SAFE_INTEGER },
  )
  const html = await new Response(prelude).text()
  if (OUT_OF_ORDER_BOUNDARY.test(html)) {
    throw new Error(`A rota ${path} gerou conteúdo fora de ordem na pré-renderização.`)
  }
  return html
}
