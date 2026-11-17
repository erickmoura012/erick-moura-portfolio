import { useMessages } from '@/i18n'

/** Indicador discreto exibido enquanto o código de uma rota é carregado. */
export function RouteFallback() {
  const t = useMessages()
  return (
    <div role="status" className="flex min-h-dvh items-center justify-center">
      <span className="flex items-center gap-3 font-mono text-sm text-subtle">
        <span aria-hidden="true" className="size-2 animate-pulse rounded-full bg-cyan" />
        {t.common.loading}
      </span>
    </div>
  )
}
