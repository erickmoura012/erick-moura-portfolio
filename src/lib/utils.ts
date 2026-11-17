import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
  timeZoneName: 'short',
})

/** Datas sempre em UTC: o HTML pré-renderizado e o cliente produzem o mesmo texto. */
export function formatDate(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '' : dateFormatter.format(date).replace(/\./g, '')
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '' : dateTimeFormatter.format(date).replace(/\./g, '')
}

const numberFormatter = new Intl.NumberFormat('pt-BR')

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

/** Remove acentos e caixa para comparações de busca. */
export function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

export function isExternalUrl(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

const SNAKE_BOUNDARY = /_([a-z0-9])/g
const CAMEL_BOUNDARY = /[A-Z]/g

/** Converte as chaves de primeiro nível de snake_case (banco) para camelCase (app). */
export function keysToCamel<T extends object>(row: Record<string, unknown>): T {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(row)) {
    result[key.replace(SNAKE_BOUNDARY, (_, char: string) => char.toUpperCase())] = value
  }
  return result as T
}

/** Converte as chaves de primeiro nível de camelCase (app) para snake_case (banco). */
export function keysToSnake(value: object): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, entry] of Object.entries(value)) {
    result[key.replace(CAMEL_BOUNDARY, (char) => `_${char.toLowerCase()}`)] = entry
  }
  return result
}
