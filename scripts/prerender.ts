/**
 * Pré-renderização das páginas públicas (SSG) — roda ao final de `npm run build`.
 *
 * 1. Guarda o HTML original como `spa.html` (casca usada por rotas só de cliente, como /admin).
 * 2. Renderiza cada rota pública com o bundle SSR e grava o HTML já com conteúdo,
 *    título, descrição e URL canônica próprios.
 * 3. Embute o script de tema (validando o hash na CSP de vercel.json) e o CSS,
 *    removendo as requisições que bloqueariam o primeiro paint; o bundle passa a ser
 *    carregado por /boot.js depois do primeiro paint (páginas pré-renderizadas).
 * 4. Gera `sitemap.xml` e `robots.txt` a partir das mesmas rotas.
 */
import { existsSync } from 'node:fs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  assertCspAllowsScript,
  deferEntryScript,
  findStylesheet,
  inlineStylesheet,
  inlineThemeScript,
} from '../build/inline-assets.ts'
import { resolveSiteUrl } from '../build/site-url.ts'

interface PrerenderRoute {
  path: string
  file: string
  title: string
  description: string
  indexable: boolean
}

interface ServerEntry {
  render: (path: string) => Promise<string>
  getPrerenderRoutes: () => PrerenderRoute[]
}

// Usa os builds de produção do React no servidor (o bundle SSR é importado depois).
process.env.NODE_ENV ??= 'production'

const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')
const ssrDir = resolve(root, 'dist-ssr')
const ROOT_PLACEHOLDER = '<div id="root"><!--app-html--></div>'

for (const file of ['.env.production.local', '.env.local', '.env.production', '.env']) {
  const path = resolve(root, file)
  if (existsSync(path)) process.loadEnvFile(path)
}
const siteUrl = resolveSiteUrl(process.env)

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function applyHead(template: string, route: PrerenderRoute): string {
  const title = escapeHtml(route.title)
  const description = escapeHtml(route.description)
  const url = siteUrl ? `${siteUrl}${route.path === '/' ? '/' : route.path}` : null

  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${description}$2`)

  if (url) {
    html = html
      .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
      .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
  }
  if (!route.indexable) {
    html = html.replace('</head>', '  <meta name="robots" content="noindex" />\n  </head>')
  }
  return html
}

const rawTemplate = await readFile(resolve(dist, 'index.html'), 'utf8')
if (!rawTemplate.includes(ROOT_PLACEHOLDER)) {
  throw new Error('index.html não contém o marcador de pré-renderização.')
}

const themeScript = (await readFile(resolve(root, 'public/theme-init.js'), 'utf8')).trim()
const vercelConfig = JSON.parse(await readFile(resolve(root, 'vercel.json'), 'utf8')) as {
  headers: { headers: { key: string; value: string }[] }[]
}
const csp = vercelConfig.headers
  .flatMap((rule) => rule.headers)
  .find((header) => header.key === 'Content-Security-Policy')?.value
if (!csp) throw new Error('vercel.json não define Content-Security-Policy.')
assertCspAllowsScript(csp, themeScript)

const stylesheet = findStylesheet(rawTemplate)
const css = stylesheet ? await readFile(resolve(dist, stylesheet.slice(1)), 'utf8') : null
const withScript = inlineThemeScript(rawTemplate, themeScript)
const template = css ? inlineStylesheet(withScript, css) : withScript

const entry = (await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href)) as ServerEntry
const routes = entry.getPrerenderRoutes()

await writeFile(
  resolve(dist, 'spa.html'),
  template.replace(ROOT_PLACEHOLDER, '<div id="root"></div>'),
)

for (const route of routes) {
  const appHtml = await entry.render(route.path)
  const page = deferEntryScript(applyHead(template, route)).replace(
    ROOT_PLACEHOLDER,
    `<div id="root" data-prerendered="${route.path}">${appHtml}</div>`,
  )
  const output = resolve(dist, route.file)
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, page)
  console.log(
    `pré-renderizado ${route.path} → dist/${route.file} (${(page.length / 1024).toFixed(1)} kB)`,
  )
}

const robots = ['User-agent: *', 'Allow: /', 'Disallow: /admin']
if (siteUrl) {
  const today = new Date().toISOString().slice(0, 10)
  const urls = routes
    .filter((route) => route.indexable)
    .map(
      (route) =>
        `  <url><loc>${siteUrl}${route.path === '/' ? '/' : route.path}</loc><lastmod>${today}</lastmod></url>`,
    )
  await writeFile(
    resolve(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
  )
  robots.push('', `Sitemap: ${siteUrl}/sitemap.xml`)
  console.log(`sitemap.xml gerado para ${siteUrl}`)
} else {
  console.warn(
    'VITE_SITE_URL não definida: sitemap.xml, canonical e og:url foram omitidos neste build.',
  )
}
await writeFile(resolve(dist, 'robots.txt'), `${robots.join('\n')}\n`)

await rm(ssrDir, { recursive: true, force: true })
