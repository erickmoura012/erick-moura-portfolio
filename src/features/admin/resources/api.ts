import { keysToCamel, keysToSnake } from '@/lib/utils'
import { ADMIN_LOCALE, requireSupabase } from '../lib/client'
import type { ResourceRow } from './types'

type DbRow = Record<string, unknown>

/** Lista todos os registros do idioma, publicados ou não (o RLS exige administrador). */
export async function listRows(table: string): Promise<ResourceRow[]> {
  const supabase = await requireSupabase()
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('locale', ADMIN_LOCALE)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw error
  return ((data ?? []) as DbRow[]).map((row) => keysToCamel<ResourceRow>(row))
}

/** Cria (sem `id`) ou atualiza um registro a partir de valores em camelCase. */
export async function saveRow(
  table: string,
  id: string | null,
  values: Record<string, unknown>,
): Promise<void> {
  const supabase = await requireSupabase()
  const payload = { ...keysToSnake(values), locale: ADMIN_LOCALE }

  const { error } =
    id === null
      ? await supabase.from(table).insert(payload)
      : await supabase.from(table).update(payload).eq('id', id)
  if (error) throw error
}

export async function patchRow(
  table: string,
  id: string,
  values: Record<string, unknown>,
): Promise<void> {
  const supabase = await requireSupabase()
  const { error } = await supabase.from(table).update(keysToSnake(values)).eq('id', id)
  if (error) throw error
}

export async function deleteRow(table: string, id: string): Promise<void> {
  const supabase = await requireSupabase()
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
}
