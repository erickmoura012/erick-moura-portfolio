import { describe, expect, it } from 'vitest'
import { buildSchema, splitLines, toFormValues, toPayload } from './schema'
import type { FieldConfig } from './types'

const fields: FieldConfig[] = [
  { name: 'title', label: 'Título', type: 'text', required: true, maxLength: 20 },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    required: true,
    pattern: { regex: /^[a-z0-9]+(-[a-z0-9]+)*$/, message: 'slug inválido' },
  },
  { name: 'location', label: 'Local', type: 'text' },
  { name: 'demoUrl', label: 'Demo', type: 'url' },
  { name: 'stack', label: 'Stack', type: 'list' },
  {
    name: 'category',
    label: 'Categoria',
    type: 'select',
    options: [
      { value: 'web', label: 'Web' },
      { value: 'ai', label: 'IA' },
    ],
  },
  { name: 'featured', label: 'Destaque', type: 'boolean', defaultValue: true },
  { name: 'sortOrder', label: 'Ordem', type: 'number' },
  { name: 'screenshots', label: 'Imagens', type: 'screenshots' },
]

const valid = {
  title: 'Finity',
  slug: 'finity',
  location: '',
  demoUrl: 'https://finity-erick.vercel.app',
  stack: 'React\n\n  TypeScript  \n',
  category: 'web',
  featured: true,
  sortOrder: 1,
  screenshots: [],
}

describe('splitLines', () => {
  it('remove linhas vazias e espaços nas pontas', () => {
    expect(splitLines(' a \n\n b\n')).toEqual(['a', 'b'])
  })
})

describe('buildSchema', () => {
  const schema = buildSchema(fields)

  it('aceita valores válidos', () => {
    expect(schema.safeParse(valid).success).toBe(true)
  })

  it('exige campos obrigatórios e respeita o tamanho máximo', () => {
    expect(schema.safeParse({ ...valid, title: '   ' }).success).toBe(false)
    expect(schema.safeParse({ ...valid, title: 'x'.repeat(21) }).success).toBe(false)
  })

  it('aplica o padrão do slug', () => {
    expect(schema.safeParse({ ...valid, slug: 'Slug Inválido' }).success).toBe(false)
  })

  it('só aceita URLs https, mas permite campo opcional vazio', () => {
    expect(schema.safeParse({ ...valid, demoUrl: 'javascript:alert(1)' }).success).toBe(false)
    expect(schema.safeParse({ ...valid, demoUrl: 'http://inseguro.test' }).success).toBe(false)
    expect(schema.safeParse({ ...valid, demoUrl: '' }).success).toBe(true)
  })

  it('recusa opções fora da lista e números inválidos', () => {
    expect(schema.safeParse({ ...valid, category: 'outra' }).success).toBe(false)
    expect(schema.safeParse({ ...valid, sortOrder: Number.NaN }).success).toBe(false)
    expect(schema.safeParse({ ...valid, sortOrder: -1 }).success).toBe(false)
  })

  it('exige texto alternativo em cada imagem', () => {
    const screenshots = [{ src: 'https://cdn.test/a.webp', alt: ' ' }]
    expect(schema.safeParse({ ...valid, screenshots }).success).toBe(false)
  })
})

describe('toFormValues / toPayload', () => {
  it('usa valores iniciais ao criar um registro', () => {
    expect(toFormValues(fields, null)).toEqual({
      title: '',
      slug: '',
      location: '',
      demoUrl: '',
      stack: '',
      category: 'web',
      featured: true,
      sortOrder: 0,
      screenshots: [],
    })
  })

  it('converte uma linha do banco em valores de formulário', () => {
    const values = toFormValues(fields, {
      title: 'Finity',
      location: null,
      stack: ['React', 'TypeScript'],
      featured: false,
      sortOrder: 3,
      screenshots: [{ src: '/a.webp', alt: 'Quadro' }, { src: 1 }],
    })
    expect(values.location).toBe('')
    expect(values.stack).toBe('React\nTypeScript')
    expect(values.featured).toBe(false)
    expect(values.sortOrder).toBe(3)
    expect(values.screenshots).toEqual([{ src: '/a.webp', alt: 'Quadro' }])
  })

  it('gera o objeto salvo: listas viram arrays e opcionais vazios viram null', () => {
    expect(toPayload(fields, valid)).toEqual({
      title: 'Finity',
      slug: 'finity',
      location: null,
      demoUrl: 'https://finity-erick.vercel.app',
      stack: ['React', 'TypeScript'],
      category: 'web',
      featured: true,
      sortOrder: 1,
      screenshots: [],
    })
  })
})
