/**
 * Captura a tela inicial das demonstrações publicadas dos projetos em destaque
 * e grava versões otimizadas em `public/projects/` (WebP + AVIF, 1280 e 640 px).
 *
 * Depois de rodar, referencie as imagens no conteúdo do projeto
 * (`screenshots: [{ src: '/projects/<slug>-1.webp', alt: '…' }]`) ou pelo painel.
 *
 * Uso: npm run assets:screenshots [-- slug1 slug2]
 */
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from '@playwright/test'
import sharp from 'sharp'
import { projects } from '../src/content/pt-BR/projects.ts'

/** Larguras geradas: a versão de 640 px atende celulares; a de 1280 px, telas maiores e retina. */
const RESPONSIVE_WIDTHS: [width: number, suffix: string][] = [
  [1280, ''],
  [640, '-640'],
]

const outDir = resolve(import.meta.dirname, '../public/projects')
const only = new Set(process.argv.slice(2))
const targets = projects.filter(
  (project) => project.demoUrl && (only.size === 0 || only.has(project.slug)),
)

await mkdir(outDir, { recursive: true })
const browser = await chromium.launch()

try {
  for (const project of targets) {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
      colorScheme: 'dark',
      reducedMotion: 'reduce',
      locale: 'pt-BR',
    })
    const page = await context.newPage()
    await page.goto(project.demoUrl as string, { waitUntil: 'networkidle', timeout: 45_000 })
    await page.waitForTimeout(800)
    const png = await page.screenshot({ type: 'png' })
    await context.close()

    const base = resolve(outDir, `${project.slug}-1`)
    for (const [width, suffix] of RESPONSIVE_WIDTHS) {
      const image = sharp(png).resize(width, Math.round((width * 800) / 1280))
      await image.clone().webp({ quality: 82 }).toFile(`${base}${suffix}.webp`)
      await image.clone().avif({ quality: 55 }).toFile(`${base}${suffix}.avif`)
    }
    console.log(`capturado ${project.slug} ← ${project.demoUrl}`)
  }
} finally {
  await browser.close()
}
