import { describe, expect, it, vi } from 'vitest'
import {
  collectGithubData,
  GithubApiError,
  isGithubData,
  isValidGithubUsername,
  summarizeActivity,
} from './github'

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
}

const rawUser = {
  login: 'erickmoura012',
  name: 'Erick Moura Almeida',
  bio: null,
  avatar_url: 'https://avatars.githubusercontent.com/u/1',
  html_url: 'https://github.com/erickmoura012',
  public_repos: 1,
  followers: 4,
  following: 6,
  created_at: '2026-01-02T21:51:53Z',
}

const rawRepo = {
  id: 10,
  name: 'Finity',
  full_name: 'erickmoura012/Finity',
  description: 'Gerenciador de tarefas',
  html_url: 'https://github.com/erickmoura012/Finity',
  homepage: 'finity-erick.vercel.app',
  language: 'TypeScript',
  topics: ['react'],
  stargazers_count: 0,
  forks_count: 0,
  fork: false,
  archived: false,
  created_at: '2026-10-04T19:24:11Z',
  updated_at: '2026-11-12T02:35:45Z',
  pushed_at: '2026-11-13T01:30:52Z',
}

function mockFetch(overrides: Record<string, () => Response> = {}) {
  return vi.fn<typeof fetch>(async (input) => {
    const url = String(input)
    for (const [fragment, factory] of Object.entries(overrides)) {
      if (url.includes(fragment)) return factory()
    }
    if (url.endsWith('/users/erickmoura012')) return jsonResponse(rawUser)
    if (url.includes('/users/erickmoura012/repos')) return jsonResponse([rawRepo])
    if (url.includes('/events/public')) {
      return jsonResponse([
        { type: 'PushEvent', created_at: '2026-11-13T01:30:52Z' },
        { type: 'PushEvent', created_at: '2026-11-11T10:00:00Z' },
        { type: 'CreateEvent', created_at: '2026-11-11T09:00:00Z' },
      ])
    }
    if (url.includes('/languages')) return jsonResponse({ TypeScript: 900, SCSS: 100 })
    return jsonResponse({}, { status: 404 })
  })
}

describe('collectGithubData', () => {
  it('normaliza usuário, repositórios, linguagens e atividade', async () => {
    const fetchImpl = mockFetch()
    const data = await collectGithubData({ username: 'erickmoura012', fetchImpl })

    expect(data.user.followers).toBe(4)
    expect(data.repos).toHaveLength(1)
    expect(data.repos[0]).toMatchObject({
      name: 'Finity',
      homepage: 'https://finity-erick.vercel.app/',
      languages: { TypeScript: 900, SCSS: 100 },
      topics: ['react'],
    })
    expect(data.activity?.total).toBe(3)
    expect(data.contributions).toBeNull()
  })

  it('não envia cabeçalho de autorização sem token (uso no navegador)', async () => {
    const fetchImpl = mockFetch()
    await collectGithubData({ username: 'erickmoura012', fetchImpl })
    const headers = fetchImpl.mock.calls[0]?.[1]?.headers as Record<string, string>
    expect(headers.Authorization).toBeUndefined()
  })

  it('sinaliza limite de requisições atingido', async () => {
    const fetchImpl = mockFetch({
      '/users/erickmoura012/repos': () =>
        jsonResponse(
          { message: 'API rate limit exceeded' },
          {
            status: 403,
            headers: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': '1794939037' },
          },
        ),
    })

    const error = await collectGithubData({ username: 'erickmoura012', fetchImpl }).catch(
      (reason: unknown) => reason,
    )
    expect(error).toBeInstanceOf(GithubApiError)
    expect((error as GithubApiError).isRateLimit).toBe(true)
    expect((error as GithubApiError).rateLimitReset).toBeInstanceOf(Date)
  })

  it('continua sem atividade quando o endpoint de eventos falha', async () => {
    const fetchImpl = mockFetch({ '/events/public': () => jsonResponse({}, { status: 500 }) })
    const data = await collectGithubData({ username: 'erickmoura012', fetchImpl })
    expect(data.activity).toBeNull()
  })

  it('rejeita nomes de usuário inválidos antes de chamar a API', async () => {
    const fetchImpl = mockFetch()
    await expect(collectGithubData({ username: '../admin', fetchImpl })).rejects.toThrow()
    expect(fetchImpl).not.toHaveBeenCalled()
  })
})

describe('utilitários', () => {
  it('valida nomes de usuário do GitHub', () => {
    expect(isValidGithubUsername('erickmoura012')).toBe(true)
    expect(isValidGithubUsername('-invalido')).toBe(false)
    expect(isValidGithubUsername('a'.repeat(40))).toBe(false)
  })

  it('preenche dias sem eventos com zero', () => {
    const activity = summarizeActivity([
      { type: 'PushEvent', created_at: '2026-11-10T00:00:00Z' },
      { type: 'PushEvent', created_at: '2026-11-12T00:00:00Z' },
    ])
    expect(activity?.days).toEqual([
      { date: '2026-11-10', count: 1 },
      { date: '2026-11-11', count: 0 },
      { date: '2026-11-12', count: 1 },
    ])
  })

  it('reconhece dados válidos e rejeita estruturas incompletas', () => {
    expect(isGithubData({ username: 'x', syncedAt: 'y', user: {}, repos: [] })).toBe(true)
    expect(isGithubData({ username: 'x' })).toBe(false)
    expect(isGithubData(null)).toBe(false)
  })
})
