import { CircleAlert, RefreshCw } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1.5 text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  )
}

interface ErrorStateProps {
  message?: string
  onRetry: () => void
}

export function ErrorState({
  message = 'Não foi possível carregar os dados.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Card role="alert" className="flex flex-col items-start gap-4 p-6">
      <CircleAlert aria-hidden="true" className="size-6 text-warning" />
      <p className="text-foreground">{message}</p>
      <Button variant="secondary" size="sm" onClick={onRetry}>
        <RefreshCw aria-hidden="true" />
        Tentar novamente
      </Button>
    </Card>
  )
}

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <p className="font-medium text-foreground">{title}</p>
      {description ? <p className="max-w-sm text-sm text-muted">{description}</p> : null}
      {action}
    </Card>
  )
}
