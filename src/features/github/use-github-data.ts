import { useQuery } from '@tanstack/react-query'
import { env } from '@/lib/env'
import {
  getGithubSnapshot,
  GITHUB_CACHE_TTL_MS,
  loadGithubData,
  type GithubResult,
} from './data-source'

const snapshot = getGithubSnapshot()
const placeholder: GithubResult | undefined = snapshot
  ? { data: snapshot, source: 'snapshot', notice: null }
  : undefined

export const githubQueryKey = ['github', env.githubUsername] as const

/**
 * Dados do GitHub com snapshot como estado inicial: a seção já nasce preenchida
 * (inclusive no HTML pré-renderizado) e é atualizada em segundo plano.
 */
export function useGithubData() {
  const query = useQuery({
    queryKey: githubQueryKey,
    queryFn: ({ signal }) => loadGithubData(signal),
    placeholderData: placeholder,
    staleTime: GITHUB_CACHE_TTL_MS / 2,
    refetchInterval: GITHUB_CACHE_TTL_MS,
    retry: false,
  })

  return {
    result: query.data ?? null,
    isLoading: query.isPending && !query.data,
    isRefreshing: query.isFetching && Boolean(query.data),
    isError: query.isError && !query.data,
    refetch: query.refetch,
  }
}
