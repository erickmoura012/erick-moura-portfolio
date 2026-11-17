import type { GithubData, GithubRepo } from '@shared/github'

export function makeRepo(overrides: Partial<GithubRepo> = {}): GithubRepo {
  return {
    id: 1,
    name: 'repo',
    fullName: 'erickmoura012/repo',
    description: null,
    htmlUrl: 'https://github.com/erickmoura012/repo',
    homepage: null,
    language: 'TypeScript',
    languages: {},
    topics: [],
    stars: 0,
    forks: 0,
    isFork: false,
    isArchived: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    pushedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

export function makeGithubData(
  repos: GithubRepo[],
  overrides: Partial<GithubData> = {},
): GithubData {
  return {
    username: 'erickmoura012',
    user: {
      login: 'erickmoura012',
      name: 'Erick Moura Almeida',
      bio: null,
      avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
      htmlUrl: 'https://github.com/erickmoura012',
      publicRepos: repos.length,
      followers: 0,
      following: 0,
      createdAt: '2026-01-02T00:00:00Z',
    },
    repos,
    activity: null,
    contributions: null,
    syncedAt: '2026-11-17T12:00:00Z',
    ...overrides,
  }
}
