import { describe, expect, it } from 'vitest'
import { makeRepo } from '@/test/fixtures'
import { DEFAULT_REPO_FILTERS, filterRepos } from './repo-filters'

const repos = [
  makeRepo({
    id: 1,
    name: 'Finity',
    description: 'Gerenciador de tarefas',
    language: 'TypeScript',
    stars: 0,
    pushedAt: '2026-11-13T00:00:00Z',
  }),
  makeRepo({
    id: 2,
    name: 'MenuFlow',
    description: 'Cardápio digital para restaurantes',
    language: 'JavaScript',
    stars: 1,
    pushedAt: '2026-10-05T00:00:00Z',
  }),
  makeRepo({
    id: 3,
    name: 'rze-sites',
    description: null,
    language: 'TypeScript',
    stars: 0,
    topics: ['nextjs', 'dashboard'],
    pushedAt: '2026-07-25T00:00:00Z',
  }),
]

const names = (list: typeof repos) => list.map((repo) => repo.name)

describe('filterRepos', () => {
  it('ordena pela atividade mais recente por padrão', () => {
    expect(names(filterRepos(repos, DEFAULT_REPO_FILTERS))).toEqual([
      'Finity',
      'MenuFlow',
      'rze-sites',
    ])
  })

  it('busca por nome, descrição e topics ignorando acentos e caixa', () => {
    expect(names(filterRepos(repos, { ...DEFAULT_REPO_FILTERS, query: 'CARDAPIO' }))).toEqual([
      'MenuFlow',
    ])
    expect(names(filterRepos(repos, { ...DEFAULT_REPO_FILTERS, query: 'dashboard' }))).toEqual([
      'rze-sites',
    ])
    expect(names(filterRepos(repos, { ...DEFAULT_REPO_FILTERS, query: 'fini' }))).toEqual([
      'Finity',
    ])
  })

  it('filtra pela linguagem principal', () => {
    expect(names(filterRepos(repos, { ...DEFAULT_REPO_FILTERS, language: 'TypeScript' }))).toEqual([
      'Finity',
      'rze-sites',
    ])
  })

  it('ordena por estrelas, desempatando pela atividade', () => {
    expect(names(filterRepos(repos, { ...DEFAULT_REPO_FILTERS, sort: 'stars' }))).toEqual([
      'MenuFlow',
      'Finity',
      'rze-sites',
    ])
  })

  it('ordena por nome sem diferenciar maiúsculas', () => {
    expect(names(filterRepos(repos, { ...DEFAULT_REPO_FILTERS, sort: 'name' }))).toEqual([
      'Finity',
      'MenuFlow',
      'rze-sites',
    ])
  })

  it('não altera a lista original', () => {
    const copy = [...repos]
    filterRepos(repos, { ...DEFAULT_REPO_FILTERS, sort: 'name' })
    expect(repos).toEqual(copy)
  })
})
