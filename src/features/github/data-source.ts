import { collectGithubData, GithubApiError, isGithubData, type GithubData } from '@shared/github'
import snapshotJson from '@/data/github-snapshot.json'
import { env } from '@/lib/env'
import { getSupabase } from '@/lib/supabase'

export type GithubSource = 'supabase' | 'live' | 'cache' | 'snapshot'
export type GithubNotice = 'rate-limited' | 'offline'

export interface GithubResult {
  data: GithubData
  source: GithubSource
  notice: GithubNotice | null
}

const CACHE_KEY = 'em-github-cache-v1'
export const GITHUB_CACHE_TTL_MS = 60 * 60_000

interface CacheEntry {
  storedAt: number
  data: GithubData
}

/** Snapshot versionado — só vale se pertencer ao usuário configurado. */
export function getGithubSnapshot(): GithubData | null {
  const snapshot: unknown = snapshotJson
  if (!isGithubData(snapshot)) return null
  return snapshot.username.toLowerCase() === env.githubUsername.toLowerCase() ? snapshot : null
}

function readCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const entry = JSON.parse(raw) as Partial<CacheEntry>
    if (typeof entry.storedAt !== 'number' || !isGithubData(entry.data)) return null
    if (entry.data.username.toLowerCase() !== env.githubUsername.toLowerCase()) return null
    return { storedAt: entry.storedAt, data: entry.data }
  } catch {
    return null
  }
}

/** Descarta o cache local — usado após uma sincronização manual no painel. */
export function clearGithubCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch {
    // Sem armazenamento local: não há o que limpar.
  }
}

function writeCache(data: GithubData): void {
  try {
    const entry: CacheEntry = { storedAt: Date.now(), data }
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
  } catch {
    // Sem armazenamento local: seguimos apenas com o cache em memória do TanStack Query.
  }
}

const RATE_LIMIT_KEY = 'em-github-rate-limit-v1'
/** Pausa usada quando o GitHub não informa quando o limite será liberado. */
const DEFAULT_RATE_LIMIT_PAUSE_MS = 15 * 60_000

/** Momento até o qual a API pública não deve ser chamada (limite atingido). */
function readRateLimitUntil(): number {
  try {
    const value = Number(localStorage.getItem(RATE_LIMIT_KEY))
    return Number.isFinite(value) ? value : 0
  } catch {
    return 0
  }
}

function rememberRateLimit(error: GithubApiError): void {
  const until = error.rateLimitReset?.getTime() ?? Date.now() + DEFAULT_RATE_LIMIT_PAUSE_MS
  try {
    localStorage.setItem(RATE_LIMIT_KEY, String(until))
  } catch {
    // Sem armazenamento local: a próxima visita tentará de novo.
  }
}

function fallback(cached: CacheEntry | null, notice: GithubNotice): GithubResult | null {
  if (cached) return { data: cached.data, source: 'cache', notice }
  const snapshot = getGithubSnapshot()
  return snapshot ? { data: snapshot, source: 'snapshot', notice } : null
}

async function readFromSupabase(): Promise<GithubData | null> {
  const pending = getSupabase()
  if (!pending) return null
  try {
    const supabase = await pending
    const { data, error } = await supabase
      .from('github_sync_metadata')
      .select('payload')
      .eq('id', 1)
      .maybeSingle()
    if (error || !data || !isGithubData(data.payload)) return null
    return data.payload
  } catch {
    return null
  }
}

/**
 * Estratégia de carregamento, da fonte mais barata para a mais cara:
 * 1. cache local ainda válido (evita gastar o limite de 60 req/h da API pública);
 * 2. dados sincronizados no Supabase pela Edge Function (inclui contribuições);
 * 3. API pública do GitHub direto do navegador, sem token — exceto enquanto o
 *    limite de requisições estiver estourado (o horário de liberação fica salvo);
 * 4. fallback: cache vencido ou snapshot versionado, com aviso ao visitante.
 */
export async function loadGithubData(signal?: AbortSignal): Promise<GithubResult> {
  const cached = readCache()
  if (cached && Date.now() - cached.storedAt < GITHUB_CACHE_TTL_MS) {
    return { data: cached.data, source: 'cache', notice: null }
  }

  const synced = await readFromSupabase()
  if (synced) {
    writeCache(synced)
    return { data: synced, source: 'supabase', notice: null }
  }

  if (Date.now() < readRateLimitUntil()) {
    const paused = fallback(cached, 'rate-limited')
    if (paused) return paused
  }

  try {
    const data = await collectGithubData({ username: env.githubUsername, signal })
    writeCache(data)
    return { data, source: 'live', notice: null }
  } catch (error) {
    if (signal?.aborted) throw error

    const isRateLimit = error instanceof GithubApiError && error.isRateLimit
    if (isRateLimit) rememberRateLimit(error)
    const result = fallback(cached, isRateLimit ? 'rate-limited' : 'offline')
    if (result) return result
    throw error
  }
}
