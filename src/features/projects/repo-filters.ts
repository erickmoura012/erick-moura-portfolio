import type { GithubRepo } from '@shared/github'
import { repoActivityTime } from '@/features/github/selectors'
import { normalizeText } from '@/lib/utils'

export const REPO_SORTS = ['updated', 'stars', 'name'] as const
export type RepoSort = (typeof REPO_SORTS)[number]

export interface RepoFilters {
  query: string
  /** Linguagem principal; string vazia significa "todas". */
  language: string
  sort: RepoSort
}

export const DEFAULT_REPO_FILTERS: RepoFilters = { query: '', language: '', sort: 'updated' }

/** Busca por nome, descrição e topics (ignorando acentos), filtro por linguagem e ordenação. */
export function filterRepos(repos: GithubRepo[], filters: RepoFilters): GithubRepo[] {
  const query = normalizeText(filters.query)

  const matches = repos.filter((repo) => {
    if (filters.language && repo.language !== filters.language) return false
    if (!query) return true
    const haystack = normalizeText([repo.name, repo.description ?? '', ...repo.topics].join(' '))
    return haystack.includes(query)
  })

  return matches.sort((a, b) => {
    switch (filters.sort) {
      case 'stars':
        return b.stars - a.stars || repoActivityTime(b) - repoActivityTime(a)
      case 'name':
        return a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
      case 'updated':
        return repoActivityTime(b) - repoActivityTime(a)
    }
  })
}
