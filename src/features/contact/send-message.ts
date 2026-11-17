import type { ContactRequest } from '@shared/contact-schema'
import { env } from '@/lib/env'

export type ContactErrorKind = 'rateLimited' | 'validation' | 'generic'

export class ContactSubmitError extends Error {
  readonly kind: ContactErrorKind

  constructor(kind: ContactErrorKind) {
    super(`Falha no envio do contato: ${kind}`)
    this.name = 'ContactSubmitError'
    this.kind = kind
  }
}

const REQUEST_TIMEOUT_MS = 15_000

/**
 * Envia a mensagem para a Edge Function `contact`, que valida de novo, aplica
 * rate limiting, grava no banco e dispara o e-mail. Nenhuma credencial de e-mail
 * existe no navegador — só a chave pública do Supabase.
 */
export async function sendContactMessage(payload: ContactRequest): Promise<void> {
  if (env.supabaseUrl === null || env.supabaseKey === null) {
    throw new ContactSubmitError('generic')
  }

  let response: Response
  try {
    response = await fetch(`${env.supabaseUrl}/functions/v1/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: env.supabaseKey },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch {
    throw new ContactSubmitError('generic')
  }

  if (response.ok) return
  if (response.status === 429) throw new ContactSubmitError('rateLimited')
  if (response.status === 400 || response.status === 422) throw new ContactSubmitError('validation')
  throw new ContactSubmitError('generic')
}
