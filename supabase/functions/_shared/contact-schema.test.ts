import { describe, expect, it } from 'vitest'
import { contactFormSchema, contactRequestSchema } from './contact-schema'

const valid = {
  name: '  Maria   Silva ',
  email: ' Maria@Exemplo.COM ',
  subject: 'Projeto de automação',
  message: 'Olá! Gostaria de conversar sobre uma automação com n8n.',
}

describe('contactFormSchema', () => {
  it('normaliza espaços e caixa do e-mail', () => {
    const result = contactFormSchema.parse(valid)
    expect(result.name).toBe('Maria Silva')
    expect(result.email).toBe('maria@exemplo.com')
  })

  it('rejeita e-mail inválido e mensagem curta com mensagens em português', () => {
    const result = contactFormSchema.safeParse({ ...valid, email: 'nao-e-email', message: 'oi' })
    expect(result.success).toBe(false)
    const messages = result.error?.issues.map((issue) => issue.message) ?? []
    expect(messages).toContain('Informe um e-mail válido.')
    expect(messages.some((message) => message.startsWith('Escreva pelo menos'))).toBe(true)
  })

  it('rejeita campos somente com espaços', () => {
    expect(contactFormSchema.safeParse({ ...valid, name: '     ' }).success).toBe(false)
  })

  it('impõe limite de tamanho da mensagem', () => {
    expect(contactFormSchema.safeParse({ ...valid, message: 'a'.repeat(4001) }).success).toBe(false)
  })
})

describe('contactRequestSchema', () => {
  it('aceita os campos anti-spam com valores padrão', () => {
    const result = contactRequestSchema.parse(valid)
    expect(result.website).toBe('')
    expect(result.elapsedMs).toBe(0)
  })

  it('rejeita tempo decorrido negativo', () => {
    expect(contactRequestSchema.safeParse({ ...valid, elapsedMs: -1 }).success).toBe(false)
  })
})
