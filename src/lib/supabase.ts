import type { SupabaseClient } from '@supabase/supabase-js'
import { env, isSupabaseConfigured } from '@/lib/env'

let clientPromise: Promise<SupabaseClient> | null = null

/**
 * Cliente Supabase carregado sob demanda: o SDK só entra no bundle baixado pelo
 * visitante quando o projeto está configurado. Retorna `null` sem configuração,
 * e o site passa a usar o conteúdo estático versionado.
 */
export function getSupabase(): Promise<SupabaseClient> | null {
  if (!isSupabaseConfigured || env.supabaseUrl === null || env.supabaseKey === null) return null

  const { supabaseUrl, supabaseKey } = env
  clientPromise ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    }),
  )
  return clientPromise
}
