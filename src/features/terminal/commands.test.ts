import { describe, expect, it } from 'vitest'
import { staticContent } from '@/content'
import { ptBR } from '@/i18n/locales/pt-BR'
import { makeGithubData, makeRepo } from '@/test/fixtures'
import { COMMAND_NAMES, runCommand } from './commands'

const context = {
  messages: ptBR,
  content: staticContent['pt-BR'],
  github: makeGithubData([makeRepo()]),
}

const textOf = (input: string) =>
  runCommand(input, context)
    .lines.map((line) => line.text)
    .join('\n')

describe('terminal', () => {
  it('oferece exatamente os comandos documentados', () => {
    expect(COMMAND_NAMES.sort()).toEqual(
      ['about', 'clear', 'contact', 'github', 'help', 'projects', 'skills'].sort(),
    )
  })

  it('help lista todos os comandos', () => {
    const output = textOf('help')
    for (const name of COMMAND_NAMES) expect(output).toContain(name)
  })

  it('aceita caixa e espaços extras', () => {
    expect(textOf('  ABOUT  ')).toContain('Erick Moura Almeida')
  })

  it('projects mostra os projetos em destaque com links', () => {
    const result = runCommand('projects', context)
    expect(result.lines.some((line) => line.kind === 'link' && line.href.includes('Finity'))).toBe(
      true,
    )
  })

  it('clear sinaliza a limpeza da tela', () => {
    expect(runCommand('clear', context).clear).toBe(true)
  })

  it('responde com erro para comandos desconhecidos sem executar nada', () => {
    const result = runCommand('rm -rf /', context)
    expect(result.lines).toEqual([{ kind: 'error', text: ptBR.terminal.notFound('rm') }])
  })

  it('não trata propriedades herdadas de objetos como comandos', () => {
    expect(runCommand('constructor', context).lines[0]?.kind).toBe('error')
    expect(runCommand('__proto__', context).lines[0]?.kind).toBe('error')
  })
})
