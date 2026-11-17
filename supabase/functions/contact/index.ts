/**
 * Edge Function `contact` — recebe o formulário de contato do portfólio.
 *
 * Fluxo: CORS restrito → validação (mesmo schema do navegador) → anti-spam
 * (honeypot + tempo mínimo) → rate limit por hash de IP → gravação com a
 * service role → e-mail via Resend (quando configurado).
 *
 * Os logs nunca contêm dados pessoais: apenas códigos de evento.
 */
import { createClient } from '@supabase/supabase-js'
import { contactRequestSchema, MIN_HUMAN_ELAPSED_MS } from '../_shared/contact-schema.ts'
import {
  corsHeaders,
  escapeHtml,
  isOriginAllowed,
  jsonResponse,
  parseAllowedOrigins,
  sha256Hex,
} from '../_shared/http.ts'

const ALLOWED_HEADERS = 'authorization, apikey, content-type, x-client-info'
const MAX_BODY_BYTES = 16 * 1024
const MAX_PER_HOUR_PER_IP = 3
const MAX_PER_DAY_GLOBAL = 100
const HOUR_MS = 60 * 60 * 1000
const DEFAULT_FROM = 'Portfólio <onboarding@resend.dev>'

interface StoredMessage {
  name: string
  email: string
  subject: string
  message: string
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || request.headers.get('cf-connecting-ip') || 'unknown'
}

async function sendEmail(message: StoredMessage): Promise<'sent' | 'failed' | 'skipped'> {
  const apiKey = Deno.env.get('RESEND_API_KEY')
  const to = Deno.env.get('CONTACT_TO_EMAIL')
  if (!apiKey || !to) return 'skipped'

  const from = Deno.env.get('CONTACT_FROM_EMAIL') || DEFAULT_FROM
  const text = [
    `Nome: ${message.name}`,
    `E-mail: ${message.email}`,
    `Assunto: ${message.subject}`,
    '',
    message.message,
  ].join('\n')
  const html = [
    '<h2 style="margin:0 0 16px">Nova mensagem pelo portfólio</h2>',
    `<p><strong>Nome:</strong> ${escapeHtml(message.name)}</p>`,
    `<p><strong>E-mail:</strong> ${escapeHtml(message.email)}</p>`,
    `<p><strong>Assunto:</strong> ${escapeHtml(message.subject)}</p>`,
    `<p style="white-space:pre-wrap">${escapeHtml(message.message)}</p>`,
  ].join('')

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: message.email,
        subject: `[Portfólio] ${message.subject}`,
        text,
        html,
      }),
    })
    if (!response.ok) console.error('contact: email_provider_error', response.status)
    return response.ok ? 'sent' : 'failed'
  } catch {
    console.error('contact: email_request_failed')
    return 'failed'
  }
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin')
  const allowed = isOriginAllowed(origin, parseAllowedOrigins(Deno.env.get('ALLOWED_ORIGINS')))
  const cors = corsHeaders(allowed ? origin : null, ALLOWED_HEADERS)

  if (!allowed) return jsonResponse({ error: 'forbidden_origin' }, 403, cors)
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed' }, 405, { ...cors, Allow: 'POST, OPTIONS' })
  }

  try {
    const declaredLength = Number(request.headers.get('content-length') ?? '0')
    if (declaredLength > MAX_BODY_BYTES) return jsonResponse({ error: 'validation' }, 400, cors)

    const raw = await request.text()
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
      return jsonResponse({ error: 'validation' }, 400, cors)
    }

    let body: unknown
    try {
      body = JSON.parse(raw)
    } catch {
      return jsonResponse({ error: 'validation' }, 400, cors)
    }

    const parsed = contactRequestSchema.safeParse(body)
    if (!parsed.success) return jsonResponse({ error: 'validation' }, 400, cors)
    const { website, elapsedMs, ...message } = parsed.data

    // Bots recebem "sucesso" para não aprenderem a contornar a proteção.
    if (website !== '' || elapsedMs < MIN_HUMAN_ELAPSED_MS) {
      console.info('contact: spam_discarded')
      return jsonResponse({ ok: true }, 200, cors)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('contact: missing_supabase_env')
      return jsonResponse({ error: 'internal' }, 500, cors)
    }
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const salt = Deno.env.get('RATE_LIMIT_SALT') || serviceRoleKey
    const ipHash = await sha256Hex(`${salt}:${clientIp(request)}`)
    const now = Date.now()

    const [perIp, global] = await Promise.all([
      supabase
        .from('contact_messages')
        .select('id', { count: 'exact', head: true })
        .eq('ip_hash', ipHash)
        .gte('created_at', new Date(now - HOUR_MS).toISOString()),
      supabase
        .from('contact_messages')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', new Date(now - 24 * HOUR_MS).toISOString()),
    ])
    if (perIp.error || global.error) {
      console.error('contact: rate_limit_query_failed')
      return jsonResponse({ error: 'internal' }, 500, cors)
    }
    if ((perIp.count ?? 0) >= MAX_PER_HOUR_PER_IP || (global.count ?? 0) >= MAX_PER_DAY_GLOBAL) {
      console.info('contact: rate_limited')
      return jsonResponse({ error: 'rate_limited' }, 429, { ...cors, 'Retry-After': '3600' })
    }

    const { data: inserted, error: insertError } = await supabase
      .from('contact_messages')
      .insert({
        ...message,
        ip_hash: ipHash,
        user_agent: request.headers.get('user-agent')?.slice(0, 300) ?? null,
        email_status: 'pending',
      })
      .select('id')
      .single()
    if (insertError || !inserted) {
      console.error('contact: insert_failed', insertError?.code ?? 'unknown')
      return jsonResponse({ error: 'internal' }, 500, cors)
    }

    // A mensagem já está salva; falha no e-mail não vira erro para o visitante.
    const emailStatus = await sendEmail(message)
    const { error: updateError } = await supabase
      .from('contact_messages')
      .update({ email_status: emailStatus })
      .eq('id', inserted.id)
    if (updateError) console.error('contact: email_status_update_failed')

    console.info('contact: stored', emailStatus)
    return jsonResponse({ ok: true }, 200, cors)
  } catch {
    console.error('contact: unexpected_error')
    return jsonResponse({ error: 'internal' }, 500, cors)
  }
})
