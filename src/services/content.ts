import { staticContent } from '@/content'
import { getSupabase } from '@/lib/supabase'
import { keysToCamel } from '@/lib/utils'
import type {
  EducationItem,
  Experience,
  Locale,
  PortfolioContent,
  Profile,
  Project,
  Skill,
} from '@/types/content'

type Row = Record<string, unknown>

/**
 * Busca o conteúdo editorial publicado no Supabase.
 * Cada bloco cai individualmente no conteúdo estático quando a tabela está vazia
 * ou a consulta falha — o site nunca fica sem conteúdo por causa do backend.
 */
export async function fetchPortfolioContent(locale: Locale): Promise<PortfolioContent> {
  const fallback = staticContent[locale]
  const pending = getSupabase()
  if (!pending) return fallback

  try {
    const supabase = await pending

    const list = async <T extends object>(table: string, fallbackItems: T[]): Promise<T[]> => {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('locale', locale)
        .eq('published', true)
        .order('sort_order', { ascending: true })
      if (error || !data || data.length === 0) return fallbackItems
      return (data as Row[]).map((row) => keysToCamel<T>(row))
    }

    const [profileResult, experiences, skills, education, projects] = await Promise.all([
      supabase.from('profile_settings').select('*').eq('locale', locale).maybeSingle(),
      list<Experience>('experiences', fallback.experiences),
      list<Skill>('skills', fallback.skills),
      list<EducationItem>('education', fallback.education),
      list<Project>('projects', fallback.projects),
    ])

    const profile =
      profileResult.error || !profileResult.data
        ? fallback.profile
        : keysToCamel<Profile>(profileResult.data as Row)

    return { profile, experiences, skills, education, projects }
  } catch (error) {
    console.warn('Conteúdo do Supabase indisponível; usando conteúdo estático.', error)
    return fallback
  }
}
