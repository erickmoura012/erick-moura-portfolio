import type { SupabaseClient } from '@supabase/supabase-js'
import { contentQueryKey } from '@/hooks/use-portfolio-content'
import { getSupabase } from '@/lib/supabase'
import type { Locale } from '@/types/content'

/** O painel edita o idioma padrão; a coluna `locale` já prepara novos idiomas. */
export const ADMIN_LOCALE: Locale = 'pt-BR'

export const adminKeys = {
  resource: (table: string) => ['admin', 'resource', table] as const,
  profile: ['admin', 'profile'] as const,
  messages: ['admin', 'messages'] as const,
  dashboard: ['admin', 'dashboard'] as const,
  githubSync: ['admin', 'github-sync'] as const,
}

/** Chave do conteúdo público, invalidada a cada alteração feita no painel. */
export const publicContentKey = contentQueryKey(ADMIN_LOCALE)

export async function requireSupabase(): Promise<SupabaseClient> {
  const pending = getSupabase()
  if (!pending) throw new Error('Supabase não configurado.')
  return pending
}

interface ErrorLike {
  code?: string
  message?: string
}

/**
 * Traduz erros do banco em mensagens úteis sem expor detalhes internos.
 * A autorização real é do RLS: se a política negar, o erro chega aqui.
 */
export function describeError(error: unknown): string {
  const { code, message } = (error ?? {}) as ErrorLike
  if (code === '23505') return 'Já existe um registro com esse identificador (slug).'
  if (code === '23514') return 'Algum campo está em um formato que o banco não aceita.'
  if (code === '42501' || message?.includes('row-level security')) {
    return 'Você não tem permissão para esta ação.'
  }
  if (code === 'PGRST116') return 'O registro não foi encontrado — ele pode ter sido removido.'
  return 'Não foi possível concluir a operação. Tente novamente.'
}

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export function formatAdminDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '—' : dateTimeFormatter.format(date)
}
