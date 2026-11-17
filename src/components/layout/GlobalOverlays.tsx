import { lazy, Suspense, useEffect } from 'react'
import { useUiState } from '@/app/providers/ui-state'

const CommandPalette = lazy(() =>
  import('@/features/command-palette/CommandPalette').then((module) => ({
    default: module.CommandPalette,
  })),
)
const TerminalDialog = lazy(() =>
  import('@/features/terminal/TerminalDialog').then((module) => ({
    default: module.TerminalDialog,
  })),
)

/**
 * Paleta de comandos (Ctrl/Cmd+K) e modo terminal. O código de cada um só é
 * baixado na primeira abertura.
 */
export function GlobalOverlays() {
  const { commandPaletteOpen, setCommandPaletteOpen, terminalOpen } = useUiState()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [commandPaletteOpen, setCommandPaletteOpen])

  return (
    <Suspense fallback={null}>
      {commandPaletteOpen ? <CommandPalette /> : null}
      {terminalOpen ? <TerminalDialog /> : null}
    </Suspense>
  )
}
