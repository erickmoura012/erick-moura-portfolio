/**
 * Gera `supabase/seed.sql` a partir do conteúdo estático versionado em
 * `src/content/pt-BR`, para que o banco e o site partam do mesmo conteúdo.
 *
 * O SQL é idempotente (`on conflict do update`): reexecutá-lo restaura estas
 * linhas ao conteúdo versionado, sobrescrevendo edições feitas pelo painel
 * nesses mesmos registros. E-mail público e currículo nunca são alterados.
 *
 * Uso: npm run seed:generate
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { education } from '../src/content/pt-BR/education.ts'
import { experiences } from '../src/content/pt-BR/experiences.ts'
import { profile } from '../src/content/pt-BR/profile.ts'
import { projects } from '../src/content/pt-BR/projects.ts'
import { skills } from '../src/content/pt-BR/skills.ts'

const LOCALE = 'pt-BR'
const output = resolve(import.meta.dirname, '..', 'supabase', 'seed.sql')

type SqlValue = string | number | boolean | null | string[] | object[]
type SqlRow = Record<string, SqlValue>

const toSnake = (key: string) => key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`)

/** Literal de texto: aspas simples duplicadas (standard_conforming_strings). */
const text = (value: string) => `'${value.replace(/'/g, "''")}'`

/** Colunas jsonb: arrays vão como JSON, e não como text[]. */
const JSONB_COLUMNS = new Set(['screenshots'])

function literal(value: SqlValue, column: string): string {
  if (value === null) return 'null'
  if (JSONB_COLUMNS.has(column)) return `${text(JSON.stringify(value))}::jsonb`
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error(`Número inválido no seed: ${value}`)
    return String(value)
  }
  if (typeof value === 'string') return text(value)
  const items = value.map((item) => {
    if (typeof item !== 'string') throw new Error(`Lista não textual na coluna ${column}.`)
    return text(item)
  })
  return items.length === 0 ? "'{}'::text[]" : `array[${items.join(', ')}]::text[]`
}

interface UpsertOptions {
  table: string
  rows: SqlRow[]
  conflict: string[]
  /** Colunas inseridas mas nunca sobrescritas em caso de conflito. */
  keepOnConflict?: string[]
}

function upsert({ table, rows, conflict, keepOnConflict = [] }: UpsertOptions): string {
  const first = rows[0]
  if (!first) return `-- ${table}: sem linhas\n`

  const keys = Object.keys(first)
  const columns = keys.map(toSnake)
  const values = rows
    .map((row) => `  (${keys.map((key) => literal(row[key] ?? null, toSnake(key))).join(', ')})`)
    .join(',\n')
  const updates = columns
    .filter((column) => !conflict.includes(column) && !keepOnConflict.includes(column))
    .map((column) => `  ${column} = excluded.${column}`)
    .join(',\n')

  return [
    `insert into public.${table} (${columns.join(', ')})`,
    'values',
    values,
    `on conflict (${conflict.join(', ')}) do update set`,
    `${updates};`,
    '',
  ].join('\n')
}

const withLocale = <T extends object>(rows: T[]): SqlRow[] =>
  rows.map((row) => ({ ...(row as SqlRow), locale: LOCALE, published: true }))

const sql = [
  '-- Gerado por `npm run seed:generate` a partir de src/content/pt-BR — não edite à mão.',
  '-- Idempotente: pode ser executado mais de uma vez. Não cria administradores.',
  '',
  'begin;',
  '',
  upsert({
    table: 'profile_settings',
    rows: [{ locale: LOCALE, ...profile }],
    conflict: ['locale'],
    keepOnConflict: ['public_email', 'resume_url'],
  }),
  upsert({ table: 'experiences', rows: withLocale(experiences), conflict: ['id'] }),
  upsert({ table: 'skills', rows: withLocale(skills), conflict: ['id'] }),
  upsert({ table: 'education', rows: withLocale(education), conflict: ['id'] }),
  upsert({ table: 'projects', rows: withLocale(projects), conflict: ['id'] }),
  'commit;',
  '',
].join('\n')

await mkdir(dirname(output), { recursive: true })
await writeFile(output, sql, 'utf8')

console.log(
  `Seed gerado em supabase/seed.sql: perfil, ${experiences.length} experiências, ${skills.length} skills, ${education.length} formações e ${projects.length} projetos.`,
)
