/**
 * Coleta e normalização de dados públicos do GitHub.
 *
 * Este módulo é agnóstico de runtime (usa apenas `fetch`) e é a única fonte de
 * verdade para três consumidores: o navegador (API pública, sem token), o script
 * `npm run sync:github` (Node) e a Edge Function `github-sync` (Deno, com token).
 * Fica em `_shared` porque é o único diretório que o bundler das Edge Functions enxerga.
 */

export interface GithubUser {
  login: string
  name: string | null
  bio: string | null
  avatarUrl: string
  htmlUrl: string
  publicRepos: number
  followers: number
  following: number
  createdAt: string
}

export interface GithubRepo {
  id: number
  name: string
  fullName: string
  description: string | null
  htmlUrl: string
  homepage: string | null
  language: string | null
  /** Bytes por linguagem, conforme o endpoint /languages. Vazio se indisponível. */
  languages: Record<string, number>
  topics: string[]
  stars: number
  forks: number
  isFork: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
  pushedAt: string | null
}

export interface GithubActivityDay {
  /** Data UTC no formato YYYY-MM-DD. */
  date: string
  count: number
}

/** Eventos públicos recentes (a API do GitHub só retém uma janela curta). */
export interface GithubActivity {
  days: GithubActivityDay[]
  byType: Record<string, number>
  total: number
  from: string
  to: string
}

export interface GithubContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

/** Calendário de contribuições — só existe quando a coleta usa token (GraphQL). */
export interface GithubContributions {
  total: number
  weeks: GithubContributionDay[][]
}

export interface GithubData {
  username: string
  user: GithubUser
  repos: GithubRepo[]
  activity: GithubActivity | null
  contributions: GithubContributions | null
  syncedAt: string
}

export class GithubApiError extends Error {
  readonly status: number
  readonly isRateLimit: boolean
  readonly rateLimitReset: Date | null

  constructor(message: string, status: number, isRateLimit: boolean, rateLimitReset: Date | null) {
    super(message)
    this.name = 'GithubApiError'
    this.status = status
    this.isRateLimit = isRateLimit
    this.rateLimitReset = rateLimitReset
  }
}

export interface CollectGithubOptions {
  username: string
  /** Token somente leitura. Nunca deve ser usado no navegador. */
  token?: string
  fetchImpl?: typeof fetch
  signal?: AbortSignal
  /** Limite de repositórios para os quais as linguagens são detalhadas. */
  maxLanguageRepos?: number
}

const API_URL = 'https://api.github.com'
const USERNAME_PATTERN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i

interface RawUser {
  login: string
  name: string | null
  bio: string | null
  avatar_url: string
  html_url: string
  public_repos: number
  followers: number
  following: number
  created_at: string
}

interface RawRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  topics?: string[]
  stargazers_count: number
  forks_count: number
  fork: boolean
  archived: boolean
  created_at: string
  updated_at: string
  pushed_at: string | null
}

interface RawEvent {
  type: string
  created_at: string
}

interface RawContributionsResponse {
  data?: {
    user?: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number
          weeks: {
            contributionDays: {
              date: string
              contributionCount: number
              contributionLevel: string
            }[]
          }[]
        }
      }
    } | null
  }
}

const CONTRIBUTION_LEVELS: Record<string, GithubContributionDay['level']> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

export function isValidGithubUsername(username: string): boolean {
  return USERNAME_PATTERN.test(username)
}

export async function collectGithubData(options: CollectGithubOptions): Promise<GithubData> {
  const { username, token, signal, maxLanguageRepos = 12 } = options
  const fetchImpl = options.fetchImpl ?? fetch

  if (!isValidGithubUsername(username)) {
    throw new Error('Usuário do GitHub inválido.')
  }

  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' }
  if (token) {
    // Cabeçalhos extras disparariam preflight CORS no navegador; só vão com token (servidor).
    headers.Authorization = `Bearer ${token}`
    headers['X-GitHub-Api-Version'] = '2022-11-28'
    headers['User-Agent'] = 'portfolio-github-sync'
  }

  async function request<T>(path: string): Promise<T> {
    const response = await fetchImpl(`${API_URL}${path}`, { headers, signal })
    if (!response.ok) throw toApiError(response)
    return (await response.json()) as T
  }

  const [rawUser, rawRepos, rawEvents] = await Promise.all([
    request<RawUser>(`/users/${username}`),
    request<RawRepo[]>(`/users/${username}/repos?per_page=100&sort=updated&type=owner`),
    request<RawEvent[]>(`/users/${username}/events/public?per_page=100`).catch(() => null),
  ])

  const languageTargets = rawRepos
    .filter((repo) => !repo.fork && repo.language !== null)
    .slice(0, maxLanguageRepos)

  const languageEntries = await Promise.all(
    languageTargets.map(async (repo) => {
      const languages = await request<Record<string, number>>(
        `/repos/${repo.full_name}/languages`,
      ).catch(() => ({}))
      return [repo.id, languages] as const
    }),
  )
  const languagesByRepo = new Map(languageEntries)

  const contributions = token
    ? await fetchContributions(fetchImpl, username, token, signal).catch(() => null)
    : null

  return {
    username: rawUser.login,
    user: {
      login: rawUser.login,
      name: rawUser.name,
      bio: rawUser.bio,
      avatarUrl: rawUser.avatar_url,
      htmlUrl: rawUser.html_url,
      publicRepos: rawUser.public_repos,
      followers: rawUser.followers,
      following: rawUser.following,
      createdAt: rawUser.created_at,
    },
    repos: rawRepos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      htmlUrl: repo.html_url,
      homepage: normalizeHomepage(repo.homepage),
      language: repo.language,
      languages: languagesByRepo.get(repo.id) ?? {},
      topics: repo.topics ?? [],
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      isFork: repo.fork,
      isArchived: repo.archived,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at,
    })),
    activity: rawEvents ? summarizeActivity(rawEvents) : null,
    contributions,
    syncedAt: new Date().toISOString(),
  }
}

function toApiError(response: Response): GithubApiError {
  const remaining = response.headers.get('x-ratelimit-remaining')
  const reset = response.headers.get('x-ratelimit-reset')
  const isRateLimit =
    response.status === 429 ||
    (response.status === 403 && (remaining === '0' || remaining === null))
  const resetDate = reset ? new Date(Number(reset) * 1000) : null

  return new GithubApiError(
    isRateLimit
      ? 'Limite de requisições da API do GitHub atingido.'
      : `A API do GitHub respondeu com status ${response.status}.`,
    response.status,
    isRateLimit,
    resetDate && !Number.isNaN(resetDate.getTime()) ? resetDate : null,
  )
}

function normalizeHomepage(homepage: string | null): string | null {
  const value = homepage?.trim()
  if (!value) return null
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`
  try {
    return new URL(withProtocol).toString()
  } catch {
    return null
  }
}

export function summarizeActivity(events: RawEvent[]): GithubActivity | null {
  if (events.length === 0) return null

  const countsByDay = new Map<string, number>()
  const byType: Record<string, number> = {}

  for (const event of events) {
    const day = event.created_at.slice(0, 10)
    countsByDay.set(day, (countsByDay.get(day) ?? 0) + 1)
    byType[event.type] = (byType[event.type] ?? 0) + 1
  }

  const sortedDays = [...countsByDay.keys()].sort()
  const from = sortedDays[0] as string
  const to = sortedDays[sortedDays.length - 1] as string

  const days: GithubActivityDay[] = []
  const cursor = new Date(`${from}T00:00:00Z`)
  const end = new Date(`${to}T00:00:00Z`)
  while (cursor <= end) {
    const date = cursor.toISOString().slice(0, 10)
    days.push({ date, count: countsByDay.get(date) ?? 0 })
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }

  return { days, byType, total: events.length, from, to }
}

async function fetchContributions(
  fetchImpl: typeof fetch,
  username: string,
  token: string,
  signal?: AbortSignal,
): Promise<GithubContributions | null> {
  const query = `query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount contributionLevel } }
        }
      }
    }
  }`

  const response = await fetchImpl(`${API_URL}/graphql`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'portfolio-github-sync',
    },
    body: JSON.stringify({ query, variables: { login: username } }),
    signal,
  })
  if (!response.ok) throw toApiError(response)

  const body = (await response.json()) as RawContributionsResponse
  const calendar = body.data?.user?.contributionsCollection.contributionCalendar
  if (!calendar) return null

  return {
    total: calendar.totalContributions,
    weeks: calendar.weeks.map((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: CONTRIBUTION_LEVELS[day.contributionLevel] ?? 0,
      })),
    ),
  }
}

/** Validação estrutural mínima para dados vindos de cache, snapshot ou banco. */
export function isGithubData(value: unknown): value is GithubData {
  if (typeof value !== 'object' || value === null) return false
  const data = value as Partial<GithubData>
  return (
    typeof data.username === 'string' &&
    typeof data.syncedAt === 'string' &&
    typeof data.user === 'object' &&
    data.user !== null &&
    Array.isArray(data.repos)
  )
}
