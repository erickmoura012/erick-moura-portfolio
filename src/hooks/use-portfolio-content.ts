import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { staticContent } from '@/content'
import { useLocale } from '@/i18n'
import { isSupabaseConfigured } from '@/lib/env'
import { fetchPortfolioContent } from '@/services/content'
import type { PortfolioContent, Project } from '@/types/content'

export const contentQueryKey = (locale: string) => ['portfolio-content', locale] as const

/**
 * Conteúdo do portfólio. O conteúdo estático aparece de imediato (e no HTML
 * pré-renderizado); com o Supabase configurado, é substituído pelo publicado no painel.
 */
export function usePortfolioContent(): PortfolioContent {
  const locale = useLocale()
  const { data } = useQuery({
    queryKey: contentQueryKey(locale),
    queryFn: () => fetchPortfolioContent(locale),
    enabled: isSupabaseConfigured,
    placeholderData: staticContent[locale],
    staleTime: 5 * 60_000,
  })
  return data ?? staticContent[locale]
}

export interface FeaturedProjects {
  primary: Project | null
  others: Project[]
  all: Project[]
}

export function useFeaturedProjects(): FeaturedProjects {
  const { projects } = usePortfolioContent()
  return useMemo(() => {
    const all = projects.filter((project) => project.featured)
    const primary = all.find((project) => project.isPrimary) ?? all[0] ?? null
    return { primary, others: all.filter((project) => project !== primary), all }
  }, [projects])
}
