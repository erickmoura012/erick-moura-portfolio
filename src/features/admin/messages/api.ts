import { keysToCamel } from '@/lib/utils'
import { requireSupabase } from '../lib/client'

export const MESSAGE_STATUSES = ['new', 'read', 'archived'] as const
export type MessageStatus = (typeof MESSAGE_STATUSES)[number]

export interface ContactMessage {
  id: string
  createdAt: string
  name: string
  email: string
  subject: string
  message: string
  status: MessageStatus
  emailStatus: 'pending' | 'sent' | 'failed' | 'skipped'
}

/** Somente as colunas exibidas — hash de IP e user agent não saem do banco. */
const MESSAGE_COLUMNS = 'id, created_at, name, email, subject, message, status, email_status'

export async function listMessages(limit = 200): Promise<ContactMessage[]> {
  const supabase = await requireSupabase()
  const { data, error } = await supabase
    .from('contact_messages')
    .select(MESSAGE_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return ((data ?? []) as Record<string, unknown>[]).map((row) => keysToCamel<ContactMessage>(row))
}

export async function countNewMessages(): Promise<number> {
  const supabase = await requireSupabase()
  const { count, error } = await supabase
    .from('contact_messages')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new')
  if (error) throw error
  return count ?? 0
}

export async function setMessageStatus(id: string, status: MessageStatus): Promise<void> {
  const supabase = await requireSupabase()
  const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id)
  if (error) throw error
}

export async function deleteMessage(id: string): Promise<void> {
  const supabase = await requireSupabase()
  const { error } = await supabase.from('contact_messages').delete().eq('id', id)
  if (error) throw error
}

export const MESSAGE_STATUS_LABELS: Record<MessageStatus, string> = {
  new: 'Nova',
  read: 'Lida',
  archived: 'Arquivada',
}

export const EMAIL_STATUS_LABELS: Record<ContactMessage['emailStatus'], string> = {
  pending: 'E-mail pendente',
  sent: 'E-mail enviado',
  failed: 'Falha no e-mail',
  skipped: 'E-mail não configurado',
}
