import { createContext, useContext } from 'react'
import type { Locale } from '@/types/content'
import { ptBR, type Messages } from './locales/pt-BR'

export const DEFAULT_LOCALE: Locale = 'pt-BR'

/** Registre novos idiomas aqui; o tipo `Messages` garante que nenhuma chave falte. */
export const dictionaries: Record<Locale, Messages> = {
  'pt-BR': ptBR,
}

export const LocaleContext = createContext<Locale>(DEFAULT_LOCALE)

export function useLocale(): Locale {
  return useContext(LocaleContext)
}

export function useMessages(): Messages {
  return dictionaries[useLocale()]
}

export type { Messages }
