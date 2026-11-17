import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Archive, Mail, MailOpen, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState, ErrorState, PageHeader } from '../components/PageStates'
import { adminKeys, describeError, formatAdminDate } from '../lib/client'
import {
  deleteMessage,
  EMAIL_STATUS_LABELS,
  listMessages,
  MESSAGE_STATUS_LABELS,
  MESSAGE_STATUSES,
  setMessageStatus,
  type ContactMessage,
  type MessageStatus,
} from '../messages/api'

const STATUS_VARIANTS: Record<MessageStatus, BadgeProps['variant']> = {
  new: 'cyan',
  read: 'neutral',
  archived: 'warning',
}

type Filter = 'all' | MessageStatus

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Todas' },
  ...MESSAGE_STATUSES.map((status) => ({ id: status, label: `${MESSAGE_STATUS_LABELS[status]}s` })),
]

export function MessagesPage() {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<Filter>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<ContactMessage | null>(null)

  const list = useQuery({ queryKey: adminKeys.messages, queryFn: () => listMessages() })
  const messages = useMemo(() => list.data ?? [], [list.data])
  const visible = useMemo(
    () => (filter === 'all' ? messages : messages.filter((message) => message.status === filter)),
    [messages, filter],
  )
  const open = messages.find((message) => message.id === openId) ?? null

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: adminKeys.messages }),
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard }),
    ])
  }

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MessageStatus }) =>
      setMessageStatus(id, status),
    onSuccess: refresh,
    onError: (error) => toast.error(describeError(error)),
  })

  const remove = useMutation({
    mutationFn: deleteMessage,
    onSuccess: async () => {
      setDeleting(null)
      setOpenId(null)
      toast.success('Mensagem excluída.')
      await refresh()
    },
    onError: (error) => toast.error(describeError(error)),
  })

  const openMessage = (message: ContactMessage) => {
    setOpenId(message.id)
    if (message.status === 'new') updateStatus.mutate({ id: message.id, status: 'read' })
  }

  return (
    <div>
      <PageHeader
        title="Mensagens"
        description="Contatos recebidos pelo formulário do site. Visíveis apenas para administradores."
      />

      <div role="group" aria-label="Filtrar mensagens" className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={cn(
              'inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium transition-colors',
              filter === item.id
                ? 'border-accent/60 bg-accent/15 text-foreground'
                : 'border-border text-muted hover:text-foreground',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {list.isPending ? (
        <div role="status" aria-label="Carregando" className="flex flex-col gap-3">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-16 rounded-lg" />
          ))}
        </div>
      ) : list.isError ? (
        <ErrorState message={describeError(list.error)} onRetry={() => void list.refetch()} />
      ) : visible.length === 0 ? (
        <EmptyState
          title="Nenhuma mensagem por aqui."
          description={
            filter === 'all'
              ? 'As mensagens enviadas pelo formulário de contato aparecem nesta lista.'
              : 'Nenhuma mensagem corresponde a este filtro.'
          }
        />
      ) : (
        <Card>
          <ul>
            {visible.map((message) => (
              <li key={message.id} className="border-b border-border last:border-b-0">
                <button
                  type="button"
                  onClick={() => openMessage(message)}
                  className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 text-left transition-colors first:rounded-t-[inherit] hover:bg-surface-hover/60"
                >
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        'block truncate text-sm',
                        message.status === 'new'
                          ? 'font-semibold text-foreground'
                          : 'font-medium text-foreground',
                      )}
                    >
                      {message.subject}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {message.name} · {formatAdminDate(message.createdAt)}
                    </span>
                  </span>
                  <Badge variant={STATUS_VARIANTS[message.status]}>
                    {MESSAGE_STATUS_LABELS[message.status]}
                  </Badge>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Dialog
        open={open !== null}
        onOpenChange={(next) => {
          if (!next) setOpenId(null)
        }}
      >
        {open ? (
          <DialogContent className="max-w-2xl">
            <DialogTitle className="pr-10 text-xl font-semibold text-foreground">
              {open.subject}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-muted">
              {open.name} · {formatAdminDate(open.createdAt)}
            </DialogDescription>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant={STATUS_VARIANTS[open.status]}>
                {MESSAGE_STATUS_LABELS[open.status]}
              </Badge>
              <Badge variant={open.emailStatus === 'failed' ? 'danger' : 'neutral'}>
                {EMAIL_STATUS_LABELS[open.emailStatus]}
              </Badge>
            </div>

            <p className="mt-5 rounded-md border border-border bg-background/60 p-4 text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground">
              {open.message}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-5">
              <Button asChild size="sm">
                <a
                  href={`mailto:${open.email}?subject=${encodeURIComponent(`Re: ${open.subject}`)}`}
                >
                  <Mail aria-hidden="true" />
                  Responder por e-mail
                </a>
              </Button>
              {open.status === 'archived' ? (
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={updateStatus.isPending}
                  onClick={() => updateStatus.mutate({ id: open.id, status: 'read' })}
                >
                  <MailOpen aria-hidden="true" />
                  Desarquivar
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={updateStatus.isPending}
                  onClick={() => updateStatus.mutate({ id: open.id, status: 'archived' })}
                >
                  <Archive aria-hidden="true" />
                  Arquivar
                </Button>
              )}
              {open.status === 'read' ? (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={updateStatus.isPending}
                  onClick={() => updateStatus.mutate({ id: open.id, status: 'new' })}
                >
                  Marcar como não lida
                </Button>
              ) : null}
              <Button
                variant="danger"
                size="sm"
                className="ml-auto"
                onClick={() => setDeleting(open)}
              >
                <Trash2 aria-hidden="true" />
                Excluir
              </Button>
            </div>
            <p className="mt-4 text-xs text-subtle">Remetente: {open.email}</p>
          </DialogContent>
        ) : null}
      </Dialog>

      <ConfirmDialog
        open={deleting !== null}
        title="Excluir mensagem?"
        description="A mensagem será removida permanentemente. Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        pending={remove.isPending}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) remove.mutate(deleting.id)
        }}
      />
    </div>
  )
}
