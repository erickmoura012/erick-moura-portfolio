import { describe, expect, it } from 'vitest'
import { buildStoragePath, validateUpload } from './storage'

const file = (name: string, type: string, bytes = 1024) =>
  new File([new Uint8Array(bytes)], name, { type })

describe('validateUpload', () => {
  it('aceita imagens e PDF dentro do limite', () => {
    expect(validateUpload(file('tela.png', 'image/png'), 'image')).toBeNull()
    expect(validateUpload(file('cv.pdf', 'application/pdf'), 'pdf')).toBeNull()
  })

  it('recusa tipos fora da lista, mesmo com extensão enganosa', () => {
    expect(validateUpload(file('tela.png', 'image/svg+xml'), 'image')).toMatch(/Formato não aceito/)
    expect(validateUpload(file('cv.pdf', 'text/html'), 'pdf')).toMatch(/Formato não aceito/)
    expect(validateUpload(file('script.pdf', 'image/png'), 'pdf')).toMatch(/Formato não aceito/)
  })

  it('recusa arquivos vazios ou acima do limite', () => {
    expect(validateUpload(file('vazio.png', 'image/png', 0), 'image')).toMatch(/vazio/)
    expect(validateUpload(file('grande.png', 'image/png', 2 * 1024 * 1024 + 1), 'image')).toMatch(
      /grande demais/,
    )
  })
})

describe('buildStoragePath', () => {
  it('usa pasta fixa, UUID, nome higienizado e extensão derivada do tipo', () => {
    const path = buildStoragePath('projects', file('Tela Início (1).PNG', 'image/png'), 'image')
    expect(path).toMatch(/^projects\/[0-9a-f-]{36}-tela-inicio-1\.png$/)
  })

  it('neutraliza tentativas de travessia de diretório', () => {
    const path = buildStoragePath('resume', file('../../etc/passwd.pdf', 'application/pdf'), 'pdf')
    expect(path).toMatch(/^resume\/[0-9a-f-]{36}-etc-passwd\.pdf$/)
    expect(path).not.toContain('..')
  })

  it('recusa tipos sem extensão conhecida', () => {
    expect(() => buildStoragePath('projects', file('a.gif', 'image/gif'), 'image')).toThrow()
  })
})
