/**
 * Resolve a URL pública do site em tempo de build.
 * Ordem: VITE_SITE_URL → domínio de produção da Vercel → desconhecida (null).
 * Quando é null, tags que exigem URL absoluta (canonical, og:url, sitemap) são omitidas
 * em vez de apontarem para um domínio inventado.
 */
export function resolveSiteUrl(env: Record<string, string | undefined>): string | null {
  const explicit = env.VITE_SITE_URL?.trim()
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  const raw = explicit || (vercel ? `https://${vercel}` : '')
  if (!raw) return null

  try {
    const url = new URL(raw)
    return url.origin + url.pathname.replace(/\/+$/, '')
  } catch {
    return null
  }
}
