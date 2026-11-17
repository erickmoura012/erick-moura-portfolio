import { Component, type ErrorInfo, type ReactNode } from 'react'
import { dictionaries, DEFAULT_LOCALE } from '@/i18n'

interface ErrorBoundaryProps {
  children: ReactNode
  /** Substitui a tela de erro padrão (útil para isolar uma seção). */
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

/** Captura erros de renderização e evita que a página inteira fique em branco. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Erro de renderização:', error.message, info.componentStack)
  }

  override render(): ReactNode {
    if (!this.state.hasError) return this.props.children
    if (this.props.fallback !== undefined) return this.props.fallback

    const t = dictionaries[DEFAULT_LOCALE].common
    return (
      <div
        role="alert"
        className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center"
      >
        <p className="font-mono text-sm text-danger">runtime_error</p>
        <h1 className="text-2xl font-semibold text-foreground">{t.errorTitle}</h1>
        <p className="max-w-md text-muted">{t.errorDescription}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          {t.reload}
        </button>
      </div>
    )
  }
}
