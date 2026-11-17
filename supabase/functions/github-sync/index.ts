/**
 * Edge Function `github-sync` — coleta os dados públicos do GitHub (com token,
 * o que inclui o calendário de contribuições) e grava em github_sync_metadata.
 *
 * Autorização (uma das duas):
 *   • cabeçalho `x-cron-secret` igual ao segredo CRON_SECRET (agendamentos);
 *   • JWT de um usuário do Supabase que seja administrador (botão do painel).
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { collectGithubData, GithubApiError } from '../_shared/github.ts'
import {
  corsHeaders,
  isOriginAllowed,
  jsonResponse,
  parseAllowedOrigins,
  timingSafeEqual,
} from '../_shared/http.ts'

const ALLOWED_HEADERS = 'authorization, apikey, content-type, x-client-info, x-cron-secret'
const DEFAULT_USERNAME = 'erickmoura012'

async function isAuthorized(request: Request, admin: SupabaseClient): Promise<boolean> {
  const cronSecret = Deno.env.get('CRON_SECRET')
  const providedSecret = request.headers.get('x-cron-secret')
  if (cronSecret && providedSecret && timingSafeEqual(providedSecret, cronSecret)) return true

  const token = request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!token) return false

  // O token é validado no servidor de autenticação; a checagem de administrador
  // usa o id verificado, nunca dados enviados pelo cliente.
  const { data, error } = await admin.auth.getUser(token)
  if (error || !data.user) return false

  const { data: row, error: adminError } = await admin
    .from('admin_users')
    .select('user_id')
    .eq('user_id', data.user.id)
    .maybeSingle()
  return !adminError && row !== null
}

function describeError(error: unknown): string {
  if (error instanceof GithubApiError) {
    return error.isRateLimit
      ? 'Limite de requisições da API do GitHub atingido.'
      : `A API do GitHub respondeu com status ${error.status}.`
  }
  return 'Falha inesperada ao consultar o GitHub.'
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin')
  // Chamadas servidor-a-servidor (cron) não enviam Origin; navegadores sempre enviam.
  const allowed =
    origin === null || isOriginAllowed(origin, parseAllowedOrigins(Deno.env.get('ALLOWED_ORIGINS')))
  const cors = corsHeaders(allowed ? origin : null, ALLOWED_HEADERS)

  if (!allowed) return jsonResponse({ error: 'forbidden_origin' }, 403, cors)
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed' }, 405, { ...cors, Allow: 'POST, OPTIONS' })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('github-sync: missing_supabase_env')
    return jsonResponse({ error: 'internal' }, 500, cors)
  }
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  try {
    if (!(await isAuthorized(request, admin))) {
      return jsonResponse({ error: 'unauthorized' }, 401, cors)
    }

    const username = Deno.env.get('GITHUB_USERNAME')?.trim() || DEFAULT_USERNAME
    const token = Deno.env.get('GITHUB_TOKEN')?.trim() || undefined

    try {
      const payload = await collectGithubData({ username, token })
      const { error } = await admin.from('github_sync_metadata').upsert(
        {
          id: 1,
          payload,
          synced_at: payload.syncedAt,
          status: 'success',
          error_message: null,
        },
        { onConflict: 'id' },
      )
      if (error) throw new Error('upsert_failed')

      console.info('github-sync: success', payload.repos.length)
      return jsonResponse(
        {
          ok: true,
          syncedAt: payload.syncedAt,
          repos: payload.repos.length,
          hasContributions: payload.contributions !== null,
        },
        200,
        cors,
      )
    } catch (error) {
      // Mantém o último payload válido e registra apenas o estado de erro.
      const message = describeError(error)
      await admin
        .from('github_sync_metadata')
        .upsert({ id: 1, status: 'error', error_message: message }, { onConflict: 'id' })
      console.error('github-sync: failed', error instanceof GithubApiError ? error.status : 'n/a')
      return jsonResponse({ error: 'sync_failed', message }, 502, cors)
    }
  } catch {
    console.error('github-sync: unexpected_error')
    return jsonResponse({ error: 'internal' }, 500, cors)
  }
})
