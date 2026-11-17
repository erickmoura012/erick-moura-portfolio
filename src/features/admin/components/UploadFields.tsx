import { ArrowUp, FileText, LoaderCircle, Trash2, Upload } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import type { ProjectScreenshot } from '@/types/content'
import {
  uploadAccept,
  uploadAsset,
  uploadHint,
  validateUpload,
  type UploadFolder,
  type UploadKind,
} from '../lib/storage'

interface UploadButtonProps {
  id: string
  kind: UploadKind
  folder: UploadFolder
  label: string
  disabled?: boolean
  onUploaded: (url: string) => void
}

/** Seleção de arquivo com validação local (tipo e tamanho) antes do envio. */
function UploadButton({
  id,
  kind,
  folder,
  label,
  disabled = false,
  onUploaded,
}: UploadButtonProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget
    const file = input.files?.[0]
    input.value = ''
    if (!file) return

    const invalid = validateUpload(file, kind)
    if (invalid) {
      setError(invalid)
      return
    }

    setError(null)
    setUploading(true)
    try {
      onUploaded(await uploadAsset(file, kind, folder))
      toast.success('Arquivo enviado.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível enviar o arquivo.')
    } finally {
      setUploading(false)
    }
  }

  const blocked = disabled || uploading

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className={cn(
          'inline-flex h-10 cursor-pointer items-center gap-2 self-start rounded-md border border-border-strong bg-surface/60 px-4 text-sm font-medium text-foreground transition-colors hover:border-accent/60 hover:bg-surface-hover',
          'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-cyan',
          blocked && 'pointer-events-none opacity-50',
        )}
      >
        {uploading ? (
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <Upload aria-hidden="true" className="size-4" />
        )}
        {uploading ? 'Enviando…' : label}
        <input
          id={id}
          type="file"
          accept={uploadAccept(kind)}
          disabled={blocked}
          onChange={(event) => void onChange(event)}
          className="sr-only"
        />
      </label>
      <p className="text-xs text-subtle">{uploadHint(kind)}</p>
      {error ? (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}

interface ScreenshotsFieldProps {
  id: string
  value: ProjectScreenshot[]
  onChange: (value: ProjectScreenshot[]) => void
}

/** Imagens do projeto: envio ao Storage, pré-visualização, texto alternativo e ordem. */
export function ScreenshotsField({ id, value, onChange }: ScreenshotsFieldProps) {
  const update = (index: number, alt: string) =>
    onChange(value.map((item, position) => (position === index ? { ...item, alt } : item)))
  const remove = (index: number) => onChange(value.filter((_, position) => position !== index))
  const moveUp = (index: number) => {
    const current = value[index]
    const previous = value[index - 1]
    if (!current || !previous) return
    const next = [...value]
    next[index - 1] = current
    next[index] = previous
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-3">
      {value.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {value.map((screenshot, index) => (
            <li
              key={screenshot.src}
              className="flex flex-col gap-3 rounded-md border border-border bg-background-alt/50 p-3 sm:flex-row sm:items-center"
            >
              <img
                src={screenshot.src}
                alt=""
                width={160}
                height={100}
                loading="lazy"
                className="aspect-[16/10] w-full shrink-0 rounded-lg border border-border object-cover object-top sm:w-40"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Input
                  value={screenshot.alt}
                  onChange={(event) => update(index, event.target.value)}
                  aria-label={`Texto alternativo da imagem ${index + 1}`}
                  placeholder="Descreva o que a imagem mostra"
                  maxLength={200}
                />
                <p className="text-xs text-subtle">
                  {index === 0 ? 'Imagem principal do projeto.' : `Imagem ${index + 1} da galeria.`}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={index === 0}
                  onClick={() => moveUp(index)}
                  aria-label={`Mover imagem ${index + 1} para cima`}
                >
                  <ArrowUp aria-hidden="true" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  aria-label={`Remover imagem ${index + 1}`}
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <UploadButton
        id={id}
        kind="image"
        folder="projects"
        label="Adicionar imagem"
        onUploaded={(src) => onChange([...value, { src, alt: '' }])}
      />
    </div>
  )
}

interface FileUrlFieldProps {
  id: string
  value: string
  onChange: (value: string) => void
}

/** Currículo em PDF: guarda a URL pública do arquivo enviado. */
export function FileUrlField({ id, value, onChange }: FileUrlFieldProps) {
  return (
    <div className="flex flex-col gap-3">
      {value ? (
        <div className="flex flex-wrap items-center gap-3 rounded-md border border-border bg-background-alt/50 px-4 py-3">
          <FileText aria-hidden="true" className="size-5 shrink-0 text-accent" />
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1 truncate text-sm font-medium text-accent transition-colors hover:text-foreground"
          >
            Abrir arquivo atual
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
          <Button variant="ghost" size="sm" onClick={() => onChange('')}>
            <Trash2 aria-hidden="true" />
            Remover
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted">Nenhum arquivo enviado.</p>
      )}

      <UploadButton
        id={id}
        kind="pdf"
        folder="resume"
        label={value ? 'Substituir arquivo' : 'Enviar PDF'}
        onUploaded={onChange}
      />
    </div>
  )
}
