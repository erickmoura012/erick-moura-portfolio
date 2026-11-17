import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useUiState } from '@/app/providers/ui-state'
import { ExternalLink } from '@/components/common/ExternalLink'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useGithubData } from '@/features/github/use-github-data'
import { usePortfolioContent } from '@/hooks/use-portfolio-content'
import { useLocale, useMessages } from '@/i18n'
import { cn } from '@/lib/utils'
import { runCommand, type TerminalLine } from './commands'

interface HistoryEntry {
  id: number
  /** Comando digitado; ausente nas linhas de boas-vindas. */
  command?: string
  lines: TerminalLine[]
}

const MAX_INPUT_LENGTH = 80

function OutputLine({ line }: { line: TerminalLine }) {
  if (line.kind === 'link') {
    const className = 'text-accent hover:text-foreground break-all underline underline-offset-4'
    return line.href.startsWith('mailto:') ? (
      <a href={line.href} className={className}>
        {line.text}
      </a>
    ) : (
      <ExternalLink href={line.href} className={className}>
        {line.text}
      </ExternalLink>
    )
  }

  return (
    <span
      className={cn(
        'break-words whitespace-pre-wrap',
        line.kind === 'heading' && 'text-cyan',
        line.kind === 'error' && 'text-danger',
        line.kind === 'text' && 'text-muted',
      )}
    >
      {line.text || ' '}
    </span>
  )
}

/** Terminal interativo com comandos fixos e seguros — nada é executado no sistema. */
export function TerminalDialog() {
  const t = useMessages()
  const locale = useLocale()
  const content = usePortfolioContent()
  const { result } = useGithubData()
  const { setTerminalOpen } = useUiState()

  const [history, setHistory] = useState<HistoryEntry[]>(() => [
    { id: 0, lines: t.terminal.welcome.map((text) => ({ kind: 'text', text })) },
  ])
  const [input, setInput] = useState('')
  const [recall, setRecall] = useState<number | null>(null)
  const nextId = useRef(1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const element = scrollRef.current
    if (element) element.scrollTop = element.scrollHeight
  }, [history])

  const typedCommands = history.flatMap((entry) => (entry.command ? [entry.command] : []))

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const command = input.trim()
    if (!command) return

    const { lines, clear } = runCommand(command, {
      messages: t,
      content,
      github: result?.data ?? null,
    })
    const id = nextId.current++
    setHistory((current) => (clear ? [] : [...current, { id, command, lines }]))
    setInput('')
    setRecall(null)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
    if (typedCommands.length === 0) return
    event.preventDefault()

    const last = typedCommands.length - 1
    const next =
      event.key === 'ArrowUp'
        ? Math.max(0, (recall ?? typedCommands.length) - 1)
        : Math.min(typedCommands.length, (recall ?? last) + 1)
    setRecall(next > last ? null : next)
    setInput(typedCommands[next] ?? '')
  }

  return (
    <Dialog open onOpenChange={setTerminalOpen}>
      <DialogContent
        lang={locale}
        className="flex h-[min(34rem,80dvh)] max-w-2xl flex-col overflow-hidden p-0 font-mono"
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          inputRef.current?.focus()
        }}
      >
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-3.5">
          <span aria-hidden="true" className="size-2.5 rounded-full bg-[#f87171]/80" />
          <span aria-hidden="true" className="size-2.5 rounded-full bg-[#fbbf24]/80" />
          <span aria-hidden="true" className="size-2.5 rounded-full bg-[#34d399]/80" />
          <DialogTitle className="ml-3 font-mono text-xs font-normal tracking-normal text-muted">
            {t.terminal.title}
          </DialogTitle>
          <DialogDescription className="sr-only">{t.terminal.description}</DialogDescription>
        </div>

        {/* O clique é só um atalho de mouse; o campo de comando já é focável pelo teclado. */}
        <div
          ref={scrollRef}
          onClick={() => inputRef.current?.focus()}
          className="flex-1 scrollbar-thin overflow-y-auto px-4 py-4 text-[0.8125rem] leading-6"
        >
          <div role="log" aria-live="polite">
            {history.map((entry) => (
              <div key={entry.id} className="mb-2">
                {entry.command ? (
                  <p className="break-all text-foreground">
                    <span className="text-success">{t.terminal.prompt}</span> {entry.command}
                  </p>
                ) : null}
                {entry.lines.map((line, index) => (
                  <p key={index}>
                    <OutputLine line={line} />
                  </p>
                ))}
              </div>
            ))}
          </div>

          <form onSubmit={onSubmit} className="flex items-center gap-2">
            <label htmlFor="terminal-input" className="shrink-0 text-success">
              <span className="sr-only">{t.terminal.inputLabel}: </span>
              <span aria-hidden="true">{t.terminal.prompt}</span>
            </label>
            <input
              ref={inputRef}
              id="terminal-input"
              value={input}
              onChange={(event) => setInput(event.target.value.slice(0, MAX_INPUT_LENGTH))}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent text-foreground caret-cyan focus:outline-none"
            />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
