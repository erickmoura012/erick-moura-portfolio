import { requireSupabase } from './client'

export const ASSET_BUCKET = 'portfolio-assets'

/** Os mesmos limites são impostos pelo bucket; aqui o erro aparece antes do envio. */
const UPLOAD_RULES = {
  image: {
    maxBytes: 2 * 1024 * 1024,
    types: {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/webp': 'webp',
      'image/avif': 'avif',
    } as Record<string, string>,
    label: 'PNG, JPG, WebP ou AVIF de até 2 MB',
  },
  pdf: {
    maxBytes: 5 * 1024 * 1024,
    types: { 'application/pdf': 'pdf' } as Record<string, string>,
    label: 'PDF de até 5 MB',
  },
} as const

export type UploadKind = keyof typeof UPLOAD_RULES
export type UploadFolder = 'projects' | 'resume'

export function uploadAccept(kind: UploadKind): string {
  return Object.keys(UPLOAD_RULES[kind].types).join(',')
}

export function uploadHint(kind: UploadKind): string {
  return UPLOAD_RULES[kind].label
}

/** Retorna a mensagem de erro, ou `null` quando o arquivo é aceito. */
export function validateUpload(file: File, kind: UploadKind): string | null {
  const rules = UPLOAD_RULES[kind]
  if (!(file.type in rules.types)) return `Formato não aceito. Envie ${rules.label}.`
  if (file.size === 0) return 'O arquivo está vazio.'
  if (file.size > rules.maxBytes) return `Arquivo grande demais. Envie ${rules.label}.`
  return null
}

function sanitizeBaseName(fileName: string): string {
  const base = fileName.replace(/\.[^.]*$/, '')
  const safe = base
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
  return safe || 'arquivo'
}

/**
 * Caminho seguro: pasta fixa + UUID + nome higienizado. A extensão vem do
 * tipo MIME validado, nunca do nome informado pelo usuário.
 */
export function buildStoragePath(folder: UploadFolder, file: File, kind: UploadKind): string {
  const extension = UPLOAD_RULES[kind].types[file.type]
  if (!extension) throw new Error('Tipo de arquivo não aceito.')
  return `${folder}/${crypto.randomUUID()}-${sanitizeBaseName(file.name)}.${extension}`
}

/** Envia o arquivo ao bucket público e devolve a URL pública. */
export async function uploadAsset(
  file: File,
  kind: UploadKind,
  folder: UploadFolder,
): Promise<string> {
  const invalid = validateUpload(file, kind)
  if (invalid) throw new Error(invalid)

  const supabase = await requireSupabase()
  const path = buildStoragePath(folder, file, kind)
  const { error } = await supabase.storage.from(ASSET_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) throw new Error('Não foi possível enviar o arquivo. Tente novamente.')

  return supabase.storage.from(ASSET_BUCKET).getPublicUrl(path).data.publicUrl
}
