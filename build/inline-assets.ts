import { createHash } from 'node:crypto'

const THEME_SCRIPT_TAG = '<script src="/theme-init.js"></script>'
const STYLESHEET_TAG = /<link rel="stylesheet"(?: crossorigin)? href="(\/assets\/[^"]+\.css)">/

/** Hash no formato aceito pela Content-Security-Policy (`'sha256-…'`). */
export function cspHash(content: string): string {
  return `'sha256-${createHash('sha256').update(content, 'utf8').digest('base64')}'`
}

/**
 * Embute o script de tema no HTML: ele precisa rodar antes da primeira pintura,
 * e um arquivo externo custaria uma ida e volta bloqueante na rede.
 */
export function inlineThemeScript(html: string, script: string): string {
  if (!html.includes(THEME_SCRIPT_TAG)) {
    throw new Error('Tag do script de tema não encontrada no HTML.')
  }
  return html.replace(THEME_SCRIPT_TAG, () => `<script>${script}</script>`)
}

/** Caminho público da folha de estilos gerada pelo Vite, se houver. */
export function findStylesheet(html: string): string | null {
  return STYLESHEET_TAG.exec(html)?.[1] ?? null
}

/** Troca o <link> da folha de estilos pelo CSS embutido (evita bloquear o primeiro paint). */
export function inlineStylesheet(html: string, css: string): string {
  return html.replace(
    STYLESHEET_TAG,
    () => `<style>${css.replace(/<\/style/gi, '<\\/style')}</style>`,
  )
}

/** Garante que a CSP publicada autoriza exatamente o script embutido. */
export function assertCspAllowsScript(policy: string, script: string): void {
  const hash = cspHash(script)
  if (!policy.includes(hash)) {
    throw new Error(
      `A Content-Security-Policy de vercel.json não autoriza o script de tema embutido.\n` +
        `Atualize a diretiva script-src com ${hash}`,
    )
  }
}

const ENTRY_SCRIPT_TAG = /<script type="module" crossorigin src="(\/assets\/[^"]+\.js)"><\/script>/
const MODULE_PRELOAD_TAG = /\s*<link rel="modulepreload" crossorigin href="\/assets\/[^"]+\.js">/g

/**
 * Nas páginas pré-renderizadas, troca a tag do bundle pelo carregador `/boot.js`,
 * que só baixa o JavaScript após o primeiro paint (ver public/boot.js). Os
 * modulepreload saem junto, pois também anteciparia o download.
 */
export function deferEntryScript(html: string): string {
  const match = ENTRY_SCRIPT_TAG.exec(html)
  if (!match) throw new Error('Tag do bundle principal não encontrada no HTML.')
  return html
    .replace(MODULE_PRELOAD_TAG, '')
    .replace(
      ENTRY_SCRIPT_TAG,
      () => `<script src="/boot.js" data-entry="${match[1]}" defer></script>`,
    )
}
