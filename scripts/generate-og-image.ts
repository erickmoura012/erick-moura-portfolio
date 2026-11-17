/**
 * Gera as imagens de marca em `public/`: imagem de compartilhamento (Open Graph,
 * 1200×630), apple-touch-icon e ícones do manifest. As imagens são desenhadas em
 * SVG. A imagem OG é renderizada no Chromium do Playwright (que aplica as fontes
 * do projeto via @font-face); os ícones, sem texto, são rasterizados com sharp.
 *
 * Uso: npm run assets:og
 */
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from '@playwright/test'
import sharp from 'sharp'

const root = resolve(import.meta.dirname, '..')
const publicDir = resolve(root, 'public')
const fontsDir = resolve(root, 'node_modules/@fontsource-variable')

const MONOGRAM = 'M13 10.5H7.5v11H13M7.5 16h4.5M16.5 21.5v-11l4 5.5 4-5.5v11'

async function fontFace(family: string, file: string): Promise<string> {
  const data = await readFile(resolve(fontsDir, file))
  return `@font-face{font-family:'${family}';src:url(data:font/woff2;base64,${data.toString('base64')}) format('woff2');font-weight:100 900;}`
}

const ogSvg = (fonts: string) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style>${fonts}</style>
    <radialGradient id="glowA" cx="0.1" cy="0" r="0.8">
      <stop offset="0" stop-color="#2563eb" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#2563eb" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="1" cy="0.1" r="0.7">
      <stop offset="0" stop-color="#8b5cf6" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#3b82f6"/>
      <stop offset="1" stop-color="#22d3ee"/>
    </linearGradient>
    <linearGradient id="frame" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#3b82f6"/>
      <stop offset="1" stop-color="#22d3ee"/>
    </linearGradient>
    <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M56 0H0V56" fill="none" stroke="#94a3b8" stroke-opacity="0.07"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#050816"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glowA)"/>
  <rect width="1200" height="630" fill="url(#glowB)"/>

  <g transform="translate(80 80) scale(2.5)">
    <rect x="1" y="1" width="30" height="30" rx="9" fill="#0b1020" stroke="url(#frame)" stroke-width="1.2"/>
    <path d="${MONOGRAM}" fill="none" stroke="#f8fafc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <text x="80" y="268" font-family="JetBrains Mono" font-size="26" fill="#22d3ee">// portfólio</text>
  <text x="76" y="372" font-family="Space Grotesk" font-weight="600" font-size="104" fill="#f8fafc" letter-spacing="-3">Erick Moura</text>
  <text x="80" y="438" font-family="Space Grotesk" font-weight="500" font-size="40" fill="url(#accent)">Desenvolvedor Full Stack</text>
  <text x="80" y="494" font-family="Geist" font-size="30" fill="#94a3b8">Automações · Integrações de APIs · Inteligência Artificial</text>

  <rect x="80" y="540" width="1040" height="1" fill="#94a3b8" fill-opacity="0.15"/>
  <text x="80" y="582" font-family="JetBrains Mono" font-size="22" fill="#7c8ba1">github.com/erickmoura012</text>
</svg>`

const iconSvg = (size: number, padding: number) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="frame" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#3b82f6"/>
      <stop offset="1" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" fill="#050816"/>
  <g transform="translate(${padding} ${padding}) scale(${(32 - padding * 2) / 32})">
    <rect x="1" y="1" width="30" height="30" rx="9" fill="#0b1020" stroke="url(#frame)" stroke-width="1.5"/>
    <path d="${MONOGRAM}" fill="none" stroke="#f8fafc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`

const fonts = (
  await Promise.all([
    fontFace('Space Grotesk', 'space-grotesk/files/space-grotesk-latin-wght-normal.woff2'),
    fontFace('Geist', 'geist/files/geist-latin-wght-normal.woff2'),
    fontFace('JetBrains Mono', 'jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2'),
  ])
).join('')

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
  await page.setContent(`<!doctype html><html><body style="margin:0">${ogSvg(fonts)}</body></html>`)
  await page.evaluate(() => document.fonts.ready)
  const png = await page.locator('svg').screenshot({ type: 'png' })
  await sharp(png).png({ compressionLevel: 9 }).toFile(resolve(publicDir, 'og-image.png'))
} finally {
  await browser.close()
}

const icons: [file: string, size: number, padding: number][] = [
  ['apple-touch-icon.png', 180, 3],
  ['icon-192.png', 192, 3],
  ['icon-512.png', 512, 5],
]
for (const [file, size, padding] of icons) {
  await sharp(Buffer.from(iconSvg(size, padding)))
    .png()
    .toFile(resolve(publicDir, file))
}

console.log('Imagens geradas: og-image.png, apple-touch-icon.png, icon-192.png, icon-512.png')
