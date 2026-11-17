import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { horizontalOverflow, isolateNetwork, openInteractive } from './helpers.ts'

test.beforeEach(async ({ page }) => {
  await isolateNetwork(page)
})

test('a home é pré-renderizada com conteúdo e SEO', async ({ page, request }) => {
  const html = await (await request.get('/')).text()
  expect(html).toContain('data-prerendered="/"')
  expect(html).toContain('Erick Moura')
  expect(html).toContain('application/ld+json')

  await page.goto('/')
  await expect(page).toHaveTitle('Erick Moura | Desenvolvedor Full Stack & Automações com IA')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Erick Moura')
})

test.describe('sem JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('conteúdo e links de seção funcionam (aprimoramento progressivo)', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { level: 2, name: 'Projetos em destaque' }),
    ).toBeAttached()
    await expect(
      page.getByRole('heading', { level: 2, name: 'Atividade no GitHub' }),
    ).toBeAttached()
    await page.goto('/#contato')
    await expect(
      page.getByRole('heading', { level: 2, name: 'Vamos construir algo incrível juntos?' }),
    ).toBeInViewport()
  })
})

test('não há overflow horizontal', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0)
})

test('navegação leva às seções', async ({ page, isMobile }) => {
  await openInteractive(page, '/')
  if (isMobile) {
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await page.getByRole('dialog').getByRole('link', { name: 'Projetos' }).click()
  } else {
    await page.getByRole('banner').getByRole('link', { name: 'Projetos' }).click()
  }
  await expect(page).toHaveURL(/#projetos$/)
  await expect(
    page.getByRole('heading', { level: 2, name: 'Projetos em destaque' }),
  ).toBeInViewport()
})

test('projetos do GitHub carregam do snapshot e podem ser filtrados', async ({ page }) => {
  await openInteractive(page, '/#projetos')
  const search = page.getByRole('searchbox', { name: 'Buscar repositório' })
  // A seção hidrata quando o código dela chega (hidratação seletiva); repete até responder.
  await expect(async () => {
    await search.fill('')
    await search.fill('menu')
    await expect(page.getByText('1 repositório encontrado')).toBeVisible({ timeout: 1000 })
  }).toPass({ timeout: 10_000 })
  await expect(page.getByRole('heading', { level: 4, name: /MenuFlow/ })).toBeVisible()
})

test('estudo do projeto é acessível por URL direta', async ({ page, request }) => {
  const html = await (await request.get('/projetos/finity')).text()
  expect(html).toContain('data-prerendered="/projetos/finity"')
  expect(html).toContain('<title>Finity — Projeto | Erick Moura</title>')

  await page.goto('/projetos/finity')
  await expect(page.getByRole('heading', { level: 1, name: 'Finity' })).toBeVisible()
  await expect(page).toHaveTitle(/Finity/)
})

test('rota inexistente mostra a página 404', async ({ page }) => {
  await page.goto('/404')
  await expect(page.getByRole('heading', { level: 1, name: 'Rota não encontrada' })).toBeVisible()
})

test('alternância de tema persiste entre visitas', async ({ page }) => {
  await openInteractive(page, '/')
  const html = page.locator('html')
  const initial = await html.getAttribute('data-theme')
  await page.getByRole('button', { name: 'Alternar entre tema claro e escuro' }).click()
  const toggled = initial === 'dark' ? 'light' : 'dark'
  await expect(html).toHaveAttribute('data-theme', toggled)
  await page.reload()
  await expect(html).toHaveAttribute('data-theme', toggled)
})

test('paleta de comandos abre com o atalho', async ({ page, isMobile }) => {
  test.skip(isMobile, 'atalho de teclado é recurso de desktop')
  await openInteractive(page, '/')
  await page.keyboard.press('Control+k')
  await expect(page.getByRole('dialog', { name: 'Paleta de comandos' })).toBeVisible()
})

for (const theme of ['dark', 'light'] as const) {
  test(`sem violações de acessibilidade detectáveis (${theme})`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem('em-theme', value), theme)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await openInteractive(page, '/')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.evaluate(() => window.scrollTo(0, 0))

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([])
  })
}
