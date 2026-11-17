import { z } from 'zod'
import type { ProjectScreenshot } from '@/types/content'
import type { FieldConfig, FormValue, FormValues } from './types'

// Sem compilação JIT (new Function): a CSP do site bloqueia eval, e o Zod só a tentaria
// para acelerar a validação. Precisa rodar antes da criação dos schemas.
z.config({ jitless: true })

const MAX_LIST_ITEMS = 40
const MAX_LIST_ITEM_LENGTH = 400
const MAX_SCREENSHOTS = 8

export function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

function textSchema(field: FieldConfig, defaultMax: number) {
  const max = field.maxLength ?? defaultMax
  let schema = z.string().trim().max(max, `Use no máximo ${max} caracteres.`)
  if (field.required) schema = schema.min(1, 'Campo obrigatório.')
  return schema
}

function fieldSchema(field: FieldConfig): z.ZodType {
  switch (field.type) {
    case 'text': {
      const schema = textSchema(field, 200)
      const { pattern } = field
      return pattern
        ? schema.refine((value) => value === '' || pattern.regex.test(value), pattern.message)
        : schema
    }
    case 'textarea':
      return textSchema(field, 2000)
    case 'url':
      return textSchema(field, 500).refine(
        (value) => value === '' || isHttpsUrl(value),
        'Informe uma URL completa começando com https://',
      )
    case 'email':
      return textSchema(field, 254).refine(
        (value) => value === '' || z.email().safeParse(value).success,
        'Informe um e-mail válido.',
      )
    case 'pdf':
      return textSchema(field, 1000)
    case 'list':
      return z.string().superRefine((value, context) => {
        const items = splitLines(value)
        if (field.required && items.length === 0) {
          context.addIssue({ code: 'custom', message: 'Informe pelo menos um item.' })
        }
        if (items.length > MAX_LIST_ITEMS) {
          context.addIssue({ code: 'custom', message: `Use no máximo ${MAX_LIST_ITEMS} itens.` })
        }
        if (items.some((item) => item.length > MAX_LIST_ITEM_LENGTH)) {
          context.addIssue({
            code: 'custom',
            message: `Cada item pode ter até ${MAX_LIST_ITEM_LENGTH} caracteres.`,
          })
        }
      })
    case 'select': {
      const values = (field.options ?? []).map((option) => option.value)
      return z.string().refine((value) => values.includes(value), 'Selecione uma opção.')
    }
    case 'boolean':
      return z.boolean()
    case 'number':
      return z
        .number({ error: 'Informe um número.' })
        .int('Use um número inteiro.')
        .min(0, 'Use um número a partir de 0.')
        .max(9999, 'Use um número até 9999.')
    case 'screenshots':
      return z
        .array(
          z.object({
            src: z.string().min(1),
            alt: z
              .string()
              .trim()
              .min(1, 'Descreva a imagem (texto alternativo).')
              .max(200, 'Use no máximo 200 caracteres.'),
          }),
        )
        .max(MAX_SCREENSHOTS, `Use no máximo ${MAX_SCREENSHOTS} imagens.`)
  }
}

/** Schema Zod derivado da configuração de campos — a mesma fonte do formulário. */
export function buildSchema(fields: FieldConfig[]) {
  return z.object(Object.fromEntries(fields.map((field) => [field.name, fieldSchema(field)])))
}

function emptyValue(field: FieldConfig): FormValue {
  if (field.defaultValue !== undefined) return field.defaultValue
  switch (field.type) {
    case 'boolean':
      return false
    case 'number':
      return 0
    case 'screenshots':
      return []
    case 'select':
      return field.options?.[0]?.value ?? ''
    default:
      return ''
  }
}

function isScreenshot(value: unknown): value is ProjectScreenshot {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Partial<ProjectScreenshot>
  return typeof candidate.src === 'string' && typeof candidate.alt === 'string'
}

/** Converte uma linha do banco (ou nada, ao criar) nos valores do formulário. */
export function toFormValues(
  fields: FieldConfig[],
  row: Record<string, unknown> | null,
): FormValues {
  const values: FormValues = {}

  for (const field of fields) {
    const raw = row?.[field.name]
    if (row === null || raw === undefined) {
      values[field.name] = emptyValue(field)
      continue
    }

    switch (field.type) {
      case 'boolean':
        values[field.name] = raw === true
        break
      case 'number':
        values[field.name] = typeof raw === 'number' ? raw : 0
        break
      case 'list':
        values[field.name] = Array.isArray(raw) ? raw.map(String).join('\n') : ''
        break
      case 'screenshots':
        values[field.name] = Array.isArray(raw) ? raw.filter(isScreenshot) : []
        break
      default:
        values[field.name] = typeof raw === 'string' ? raw : ''
    }
  }

  return values
}

/** Converte os valores validados do formulário no objeto salvo (ainda em camelCase). */
export function toPayload(fields: FieldConfig[], values: FormValues): Record<string, unknown> {
  const payload: Record<string, unknown> = {}

  for (const field of fields) {
    const value = values[field.name]

    switch (field.type) {
      case 'list':
        payload[field.name] = splitLines(typeof value === 'string' ? value : '')
        break
      case 'boolean':
        payload[field.name] = value === true
        break
      case 'number':
        payload[field.name] = typeof value === 'number' && Number.isFinite(value) ? value : 0
        break
      case 'screenshots':
        payload[field.name] = Array.isArray(value)
          ? value.map((item) => ({ src: item.src, alt: item.alt.trim() }))
          : []
        break
      case 'select':
        payload[field.name] = value
        break
      default: {
        const text = typeof value === 'string' ? value.trim() : ''
        payload[field.name] = text === '' && !field.required ? null : text
      }
    }
  }

  return payload
}
