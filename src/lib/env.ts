const read = (value: string | undefined): string | null => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

/** Variáveis públicas do frontend. Segredos nunca passam por aqui. */
export const env = {
  supabaseUrl: read(import.meta.env.VITE_SUPABASE_URL),
  supabaseKey: read(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY),
  githubUsername: read(import.meta.env.VITE_GITHUB_USERNAME) ?? 'erickmoura012',
} as const

export const isSupabaseConfigured = env.supabaseUrl !== null && env.supabaseKey !== null
