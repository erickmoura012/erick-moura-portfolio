/**
 * Gera `src/data/github-snapshot.json` com os dados públicos do GitHub.
 *
 * O snapshot é o fallback versionado: o site o exibe imediatamente e quando a
 * API pública está indisponível ou com limite atingido. Com GITHUB_TOKEN definido
 * (somente leitura), inclui também o calendário de contribuições.
 *
 * Uso: npm run sync:github
 */
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { collectGithubData, GithubApiError } from '../supabase/functions/_shared/github.ts'

const root = resolve(import.meta.dirname, '..')
for (const file of ['.env.local', '.env']) {
  const path = resolve(root, file)
  if (existsSync(path)) process.loadEnvFile(path)
}

const username = process.env.VITE_GITHUB_USERNAME?.trim() || 'erickmoura012'
const token = process.env.GITHUB_TOKEN?.trim() || undefined
const output = resolve(root, 'src/data/github-snapshot.json')

try {
  const data = await collectGithubData({ username, token })
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, `${JSON.stringify(data, null, 2)}\n`, 'utf8')

  console.log(`Snapshot atualizado: ${data.repos.length} repositórios de @${data.username}.`)
  console.log(
    data.contributions
      ? `Calendário de contribuições incluído (${data.contributions.total} no último ano).`
      : 'Calendário de contribuições não incluído (defina GITHUB_TOKEN para habilitar).',
  )
} catch (error) {
  if (error instanceof GithubApiError && error.isRateLimit) {
    const reset = error.rateLimitReset?.toLocaleTimeString('pt-BR') ?? 'em breve'
    console.error(`Limite da API do GitHub atingido. Tente novamente após ${reset}.`)
  } else {
    console.error(
      'Falha ao sincronizar com o GitHub:',
      error instanceof Error ? error.message : error,
    )
  }
  process.exitCode = 1
}
