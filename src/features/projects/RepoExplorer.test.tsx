import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { staticContent } from '@/content'
import { makeRepo } from '@/test/fixtures'
import { renderWithProviders } from '@/test/render'
import { RepoExplorer } from './RepoExplorer'

const repos = [
  makeRepo({ id: 1, name: 'Finity', language: 'TypeScript', pushedAt: '2026-11-13T00:00:00Z' }),
  makeRepo({
    id: 2,
    name: 'MenuFlow',
    language: 'JavaScript',
    stars: 1,
    homepage: 'https://menuflow-phi.vercel.app/',
    pushedAt: '2026-10-05T00:00:00Z',
  }),
  makeRepo({ id: 3, name: 'rze-sites', language: 'TypeScript', isArchived: true }),
]

function renderExplorer() {
  return renderWithProviders(
    <RepoExplorer
      repos={repos}
      languages={['JavaScript', 'TypeScript']}
      featured={staticContent['pt-BR'].projects}
      profileUrl="https://github.com/erickmoura012"
      isLoading={false}
    />,
  )
}

const cardNames = () =>
  screen
    .getAllByRole('heading', { level: 4 })
    .map((heading) => heading.textContent.replace(' (abre em nova aba)', ''))

describe('RepoExplorer', () => {
  it('lista todos os repositórios com contagem acessível', () => {
    renderExplorer()
    expect(screen.getByText('3 repositórios encontrados')).toBeInTheDocument()
    expect(screen.getByText('Arquivado')).toBeInTheDocument()
  })

  it('busca por nome', async () => {
    const user = userEvent.setup()
    renderExplorer()
    await user.type(screen.getByRole('searchbox', { name: 'Buscar repositório' }), 'menu')

    expect(screen.getByText('1 repositório encontrado')).toBeInTheDocument()
    expect(cardNames()).toEqual(['MenuFlow'])
  })

  it('filtra por linguagem e ordena por estrelas', async () => {
    const user = userEvent.setup()
    renderExplorer()

    await user.selectOptions(screen.getByRole('combobox', { name: 'Linguagem' }), 'TypeScript')
    expect(cardNames()).toEqual(['Finity', 'rze-sites'])

    await user.selectOptions(screen.getByRole('combobox', { name: 'Linguagem' }), '')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Ordenar por' }), 'stars')
    expect(cardNames()[0]).toBe('MenuFlow')
  })

  it('mostra estado vazio com ação para limpar filtros', async () => {
    const user = userEvent.setup()
    renderExplorer()
    await user.type(screen.getByRole('searchbox'), 'nao-existe')

    expect(screen.getByText('Nenhum repositório corresponde a esses filtros.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Limpar filtros' }))
    expect(screen.getByText('3 repositórios encontrados')).toBeInTheDocument()
  })

  it('liga repositórios em destaque ao estudo do projeto e mostra o link de demonstração', () => {
    renderExplorer()
    expect(screen.getByRole('link', { name: 'Ver estudo do projeto Finity' })).toHaveAttribute(
      'href',
      '/projetos/finity',
    )
    expect(screen.getByRole('link', { name: /Demonstração de MenuFlow/ })).toHaveAttribute(
      'href',
      'https://menuflow-phi.vercel.app/',
    )
  })
})
