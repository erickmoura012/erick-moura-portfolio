import { LoaderCircle } from 'lucide-react'
import { AlertDialog } from 'radix-ui'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: ReactNode
  confirmLabel: string
  pending?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/** Confirmação para ações destrutivas: o foco inicial fica em "Cancelar". */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  pending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next && !pending) onCancel()
      }}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border-strong bg-background-alt p-6 shadow-float focus:outline-none data-[state=open]:animate-fade-in">
          <AlertDialog.Title className="text-lg font-semibold text-foreground">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm leading-relaxed text-muted">
            {description}
          </AlertDialog.Description>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <Button variant="secondary" disabled={pending}>
                Cancelar
              </Button>
            </AlertDialog.Cancel>
            <Button variant="danger" disabled={pending} onClick={onConfirm}>
              {pending ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
              {confirmLabel}
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
