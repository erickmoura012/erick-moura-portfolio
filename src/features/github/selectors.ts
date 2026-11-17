import type { GithubData, GithubRepo } from '@shared/github'

export interface LanguageShare {
  name: string
  bytes: number
  /** Fração de 0 a 1 do total de bytes. */
  share: number
}

/** Repositórios de projeto: exclui o README de perfil (repositório com o nome do usuário). */
export function selectProjectRepos(data: GithubData): GithubRepo[] {
  const username = data.username.toLowerCase()
  return data.repos.filter((repo) => repo.name.toLowerCase() !== username)
}

export function selectTotalStars(data: GithubData): number {
  return data.repos.reduce((total, repo) => total + repo.stars, 0)
}

/** Soma os bytes por linguagem dos repositórios próprios (forks não contam). */
export function selectLanguageShares(data: GithubData): LanguageShare[] {
  const totals = new Map<string, number>()
  for (const repo of data.repos) {
    if (repo.isFork) continue
    for (const [language, bytes] of Object.entries(repo.languages)) {
      totals.set(language, (totals.get(language) ?? 0) + bytes)
    }
  }

  const totalBytes = [...totals.values()].reduce((sum, bytes) => sum + bytes, 0)
  if (totalBytes === 0) return []

  return [...totals.entries()]
    .map(([name, bytes]) => ({ name, bytes, share: bytes / totalBytes }))
    .sort((a, b) => b.bytes - a.bytes)
}

export function selectRecentRepos(data: GithubData, limit = 4): GithubRepo[] {
  return [...selectProjectRepos(data)]
    .sort((a, b) => repoActivityTime(b) - repoActivityTime(a))
    .slice(0, limit)
}

export function repoActivityTime(repo: GithubRepo): number {
  return new Date(repo.pushedAt ?? repo.updatedAt).getTime()
}

export function repoActivityDate(repo: GithubRepo): string {
  return repo.pushedAt ?? repo.updatedAt
}

export function selectPrimaryLanguages(data: GithubData): string[] {
  const languages = new Set<string>()
  for (const repo of selectProjectRepos(data)) {
    if (repo.language) languages.add(repo.language)
  }
  return [...languages].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}
