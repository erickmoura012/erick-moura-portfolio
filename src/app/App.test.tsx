import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MotionConfig } from 'motion/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { UiStateProvider } from '@/app/providers/ui-state'
import { AppRoutes } from '@/app/router/AppRoutes'

vi.mock('@/lib/supabase', () => ({ getSupabase: () => null }))
vi.mock('@/features/github/data-source', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/features/github/data-source')>()
  return {
    ...original,
    loadGithubData: () =>
      Promise.resolve({ data: original.getGithubSnapshot(), source: 'snapshot', notice: null }),
  }
})

function renderRoute(route: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="always">
        <UiStateProvider>
          <MemoryRouter initialEntries={[route]}>
            <AppRoutes />
          </MemoryRouter>
        </UiStateProvider>
      </MotionConfig>
    </QueryClientProvider>,
  )
}

describe('rotas públicas', () => {
  it('renderiza a home com hero, navegação e todas as seções', async () => {
    renderRoute('/')

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Erick Moura')
    const nav = screen.getAllByRole('navigation', { name: 'Navegação principal' })[0]
    expect(nav).toBeDefined()
    for (const item of [
      'Início',
      'Sobre',
      'Experiência',
      'Skills',
      'Projetos',
      'GitHub',
      'Contato',
    ]) {
      expect(within(nav as HTMLElement).getByRole('link', { name: item })).toBeInTheDocument()
    }
    for (const title of [
      'Trajetória profissional',
      'Tecnologias e ferramentas',
      'Soluções que desenvolvo',
      'Projetos em destaque',
      'Atividade no GitHub',
      'Formação',
      'Vamos construir algo incrível juntos?',
    ]) {
      expect(await screen.findByRole('heading', { level: 2, name: title })).toBeInTheDocument()
    }
  })

  it('não exibe botão de currículo nem e-mail enquanto não forem configurados', () => {
    renderRoute('/')
    expect(screen.queryByRole('link', { name: /Baixar currículo/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Enviar e-mail/ })).not.toBeInTheDocument()
  })

  it('mostra o formulário como pendente sem Supabase configurado', async () => {
    renderRoute('/')
    expect(await screen.findByText('Formulário em configuração')).toBeInTheDocument()
  })

  it('abre o estudo de um projeto em destaque', async () => {
    renderRoute('/projetos/finity')
    expect(await screen.findByRole('heading', { level: 1, name: 'Finity' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Desafio' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Demonstração de Finity/ })).toHaveAttribute(
      'href',
      'https://finity-erick.vercel.app',
    )
  })

  it('exibe a página 404 para rotas desconhecidas e projetos inexistentes', async () => {
    const { unmount } = renderRoute('/rota-inexistente')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Rota não encontrada' }),
    ).toBeInTheDocument()
    unmount()

    renderRoute('/projetos/nao-existe')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Projeto não encontrado' }),
    ).toBeInTheDocument()
  })

  it('abre a paleta de comandos com Ctrl+K e o terminal a partir dela', async () => {
    const user = userEvent.setup()
    renderRoute('/')

    await user.keyboard('{Control>}k{/Control}')
    const palette = await screen.findByRole('dialog', { name: 'Paleta de comandos' })
    await user.type(within(palette).getByRole('combobox'), 'terminal')
    await user.keyboard('{Enter}')

    const terminal = await screen.findByRole('dialog', { name: 'Modo terminal' })
    const input = within(terminal).getByRole('textbox', { name: /Comando do terminal/ })
    await user.type(input, 'help{Enter}')
    expect(within(terminal).getByText('Comandos disponíveis:')).toBeInTheDocument()
  })
})
