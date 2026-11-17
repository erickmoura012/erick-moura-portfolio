import type { Page } from '@playwright/test'

/**
 * Bloqueia chamadas externas para que os testes sejam determinísticos e não
 * consumam o limite da API do GitHub: o site deve cair no snapshot versionado.
 */
export async function isolateNetwork(page: Page): Promise<void> {
  await page.route(/api\.github\.com|supabase\.co/, (route) => route.abort('failed'))
}

/** Largura do documento além da janela — deve ser zero (sem overflow horizontal). */
export function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
}

/** Abre a página e espera a hidratação (o bundle é carregado após o primeiro paint). */
export async function openInteractive(page: Page, path: string): Promise<void> {
  await page.goto(path)
  await page.locator('html[data-hydrated="true"]').waitFor({ state: 'attached' })
}
