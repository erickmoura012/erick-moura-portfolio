import { describe, expect, it } from 'vitest'
import { makeGithubData, makeRepo } from '@/test/fixtures'
import { niceAxisMax } from './chart-scale'
import {
  selectLanguageShares,
  selectPrimaryLanguages,
  selectProjectRepos,
  selectRecentRepos,
  selectTotalStars,
} from './selectors'

const data = makeGithubData([
  makeRepo({ id: 1, name: 'erickmoura012', language: null }),
  makeRepo({
    id: 2,
    name: 'Finity',
    stars: 2,
    languages: { TypeScript: 300, SCSS: 100 },
    pushedAt: '2026-11-13T00:00:00Z',
  }),
  makeRepo({
    id: 3,
    name: 'MenuFlow',
    language: 'JavaScript',
    stars: 1,
    languages: { JavaScript: 100 },
    pushedAt: '2026-10-05T00:00:00Z',
  }),
  makeRepo({ id: 4, name: 'fork', isFork: true, languages: { Go: 10_000 } }),
])

describe('seletores do GitHub', () => {
  it('exclui o repositório de README do perfil', () => {
    expect(selectProjectRepos(data).map((repo) => repo.name)).not.toContain('erickmoura012')
  })

  it('soma as estrelas', () => {
    expect(selectTotalStars(data)).toBe(3)
  })

  it('calcula a proporção por bytes, ignorando forks', () => {
    const shares = selectLanguageShares(data)
    expect(shares.map((share) => share.name)).toEqual(['TypeScript', 'SCSS', 'JavaScript'])
    expect(shares[0]?.share).toBeCloseTo(0.6)
    expect(shares.reduce((sum, share) => sum + share.share, 0)).toBeCloseTo(1)
  })

  it('retorna lista vazia quando o GitHub não informou linguagens', () => {
    expect(selectLanguageShares(makeGithubData([makeRepo()]))).toEqual([])
  })

  it('ordena os repositórios recentes pela atividade', () => {
    expect(selectRecentRepos(data, 2).map((repo) => repo.name)).toEqual(['Finity', 'MenuFlow'])
  })

  it('lista linguagens principais em ordem alfabética, sem duplicatas', () => {
    expect(selectPrimaryLanguages(data)).toEqual(['JavaScript', 'TypeScript'])
  })
})

describe('niceAxisMax', () => {
  it.each([
    [0, 1],
    [1, 1],
    [3, 5],
    [7, 10],
    [12, 20],
    [48, 50],
  ])('arredonda %d para %d', (input, expected) => {
    expect(niceAxisMax(input)).toBe(expected)
  })
})
