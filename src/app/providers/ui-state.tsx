import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

interface UiState {
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
  terminalOpen: boolean
  setTerminalOpen: (open: boolean) => void
}

const noop = () => undefined

const UiStateContext = createContext<UiState>({
  commandPaletteOpen: false,
  setCommandPaletteOpen: noop,
  terminalOpen: false,
  setTerminalOpen: noop,
})

/** Estado das camadas globais (paleta de comandos e modo terminal). */
export function UiStateProvider({ children }: { children: ReactNode }) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [terminalOpen, setTerminalOpen] = useState(false)

  const value = useMemo(
    () => ({ commandPaletteOpen, setCommandPaletteOpen, terminalOpen, setTerminalOpen }),
    [commandPaletteOpen, terminalOpen],
  )

  return <UiStateContext value={value}>{children}</UiStateContext>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook acoplado ao provider acima
export function useUiState(): UiState {
  return useContext(UiStateContext)
}
