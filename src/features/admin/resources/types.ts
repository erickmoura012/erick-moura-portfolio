import type { ComponentType } from 'react'
import type { BadgeProps } from '@/components/ui/badge'
import type { ProjectScreenshot } from '@/types/content'

/**
 * Tipos de campo do formulário genérico:
 * - list: várias linhas de texto, salvas como `text[]` (um item por linha)
 * - screenshots: imagens enviadas ao Storage, salvas como jsonb `[{ src, alt }]`
 * - pdf: arquivo enviado ao Storage, salvo como URL
 */
export type FieldType =
  | 'text'
  | 'textarea'
  | 'url'
  | 'email'
  | 'list'
  | 'select'
  | 'boolean'
  | 'number'
  | 'screenshots'
  | 'pdf'

export interface FieldOption {
  value: string
  label: string
}

export interface FieldConfig {
  /** Nome em camelCase; a coluna no banco é o equivalente em snake_case. */
  name: string
  label: string
  type: FieldType
  /** Campos de texto opcionais são salvos como `null` quando vazios. */
  required?: boolean
  maxLength?: number
  hint?: string
  placeholder?: string
  options?: FieldOption[]
  rows?: number
  /** Ocupa as duas colunas do formulário. */
  wide?: boolean
  pattern?: { regex: RegExp; message: string }
  /** Valor inicial ao criar um registro (padrão: vazio, `false` ou `0`). */
  defaultValue?: FormValue
}

export type FormValue = string | number | boolean | ProjectScreenshot[]
export type FormValues = Record<string, FormValue>

/** Linha vinda do banco, já convertida para camelCase. */
export type ResourceRow = Record<string, unknown> & {
  id: string
  published: boolean
  sortOrder: number
}

export interface RowBadge {
  label: string
  variant?: BadgeProps['variant']
}

export interface RowToggle {
  field: string
  label: string
}

export interface PreviewProps {
  /** Valores do formulário já no formato em que seriam salvos. */
  values: Record<string, unknown>
}

export interface ResourceConfig {
  table: string
  title: string
  description: string
  /** Substantivo no singular, usado em botões e mensagens ("projeto"). */
  singular: string
  /** Gênero do substantivo, para concordância ("Novo projeto" / "Nova skill"). */
  gender: 'm' | 'f'
  fields: FieldConfig[]
  rowTitle: (row: ResourceRow) => string
  rowSubtitle?: (row: ResourceRow) => string
  badges?: (row: ResourceRow) => RowBadge[]
  /** Alternâncias rápidas na listagem, além de "Publicado". */
  toggles?: RowToggle[]
  Preview?: ComponentType<PreviewProps>
}
