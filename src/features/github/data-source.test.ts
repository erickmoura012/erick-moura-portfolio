import { beforeEach, describe, expect, it, vi } from 'vitest'
import { makeGithubData, makeRepo } from '@/test/fixtures'

const collectGithubData = vi.fn()

vi.mock('@/lib/supabase', () => ({ getSupabase: () => null }))
vi.mock('@shared/github', async (importOriginal) => {
  const original = await importOriginal<typeof import('@shared/github')>()
  return { ...original, collectGithubData: (...args: unknown[]) => collectGithubData(...args) }
})

const { loadGithubData } = await import('./data-source')
const { GithubApiError } = await import('@shared/github')

const CACHE_KEY = 'em-github-cache-v1'
const liveData = makeGithubData([makeRepo({ name: 'live-repo' })])

describe('loadGithubData', () => {
  beforeEach(() => {
    collectGithubData.mockReset()
  })

  it('busca na API pública e grava o cache local', async () => {
    collectGithubData.mockResolvedValue(liveData)
    const result = await loadGithubData()

    expect(result).toMatchObject({ source: 'live', notice: null })
    expect(localStorage.getItem(CACHE_KEY)).toContain('live-repo')
  })

  it('usa o cache válido sem chamar a API', async () => {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ storedAt: Date.now(), data: liveData }))
    const result = await loadGithubData()

    expect(result.source).toBe('cache')
    expect(collectGithubData).not.toHaveBeenCalled()
  })

  it('cai no cache vencido quando a API atinge o limite', async () => {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ storedAt: 0, data: liveData }))
    collectGithubData.mockRejectedValue(new GithubApiError('limite', 403, true, null))
    const result = await loadGithubData()

    expect(result).toMatchObject({ source: 'cache', notice: 'rate-limited' })
  })

  it('cai no snapshot versionado quando não há cache e a rede falha', async () => {
    collectGithubData.mockRejectedValue(new TypeError('Failed to fetch'))
    const result = await loadGithubData()

    expect(result).toMatchObject({ source: 'snapshot', notice: 'offline' })
    expect(result.data.username).toBe('erickmoura012')
  })

  it('ignora cache corrompido', async () => {
    localStorage.setItem(CACHE_KEY, '{nao-e-json')
    collectGithubData.mockResolvedValue(liveData)
    await expect(loadGithubData()).resolves.toMatchObject({ source: 'live' })
  })

  it('após atingir o limite, não chama a API de novo até o horário de liberação', async () => {
    const reset = new Date(Date.now() + 30 * 60_000)
    collectGithubData.mockRejectedValue(new GithubApiError('limite', 403, true, reset))
    await loadGithubData()
    expect(collectGithubData).toHaveBeenCalledTimes(1)

    const second = await loadGithubData()
    expect(collectGithubData).toHaveBeenCalledTimes(1)
    expect(second).toMatchObject({ source: 'snapshot', notice: 'rate-limited' })
  })

  it('volta a consultar a API depois que o limite é liberado', async () => {
    localStorage.setItem('em-github-rate-limit-v1', String(Date.now() - 1000))
    collectGithubData.mockResolvedValue(liveData)
    await expect(loadGithubData()).resolves.toMatchObject({ source: 'live' })
  })
})
