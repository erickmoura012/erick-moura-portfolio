import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useMemo, useState, type ComponentType } from 'react'
import {
  Controller,
  useForm,
  useWatch,
  type Control,
  type Resolver,
  type UseFormRegister,
} from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Field, fieldA11y, Input, Select, Textarea } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { Switch } from '../components/Switch'
import { FileUrlField, ScreenshotsField } from '../components/UploadFields'
import { buildSchema, splitLines, toPayload } from './schema'
import type { FieldConfig, FormValues, PreviewProps } from './types'

/** Primeira mensagem de erro de um campo, inclusive em estruturas aninhadas (imagens). */
function firstMessage(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null) return undefined
  const { message } = error as { message?: unknown }
  if (typeof message === 'string' && message) return message
  for (const nested of Object.values(error)) {
    const found = firstMessage(nested)
    if (found) return found
  }
  return undefined
}

/** Contador ao vivo para listas com limite total (ex.: parágrafos do "Sobre mim"). */
function ListCharacterCount({
  control,
  name,
  max,
}: {
  control: Control<FormValues>
  name: string
  max: number
}) {
  const value = useWatch({ control, name })
  const total = splitLines(String(value ?? '')).reduce((sum, line) => sum + line.length, 0)
  const over = total > max
  return (
    <p
      aria-live="polite"
      className={cn('text-right font-mono text-xs', over ? 'text-danger' : 'text-subtle')}
    >
      {total.toLocaleString('pt-BR')} / {max.toLocaleString('pt-BR')} caracteres
    </p>
  )
}

interface FieldControlProps {
  id: string
  field: FieldConfig
  error: string | undefined
  control: Control<FormValues>
  register: UseFormRegister<FormValues>
}

function FieldControl({ id, field, error, control, register }: FieldControlProps) {
  const a11y = fieldA11y(id, error)

  switch (field.type) {
    case 'textarea':
      return (
        <Textarea
          rows={field.rows ?? 4}
          placeholder={field.placeholder}
          {...a11y}
          {...register(field.name)}
        />
      )
    case 'list':
      return (
        <>
          <Textarea
            rows={field.rows ?? 5}
            placeholder={field.placeholder}
            {...a11y}
            {...register(field.name)}
          />
          {field.maxLength !== undefined ? (
            <ListCharacterCount control={control} name={field.name} max={field.maxLength} />
          ) : null}
        </>
      )
    case 'select':
      return (
        <Select {...a11y} {...register(field.name)}>
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      )
    case 'number':
      return (
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          {...a11y}
          {...register(field.name, { valueAsNumber: true })}
        />
      )
    case 'screenshots':
      return (
        <Controller
          control={control}
          name={field.name}
          render={({ field: controller }) => (
            <ScreenshotsField
              id={id}
              value={Array.isArray(controller.value) ? controller.value : []}
              onChange={controller.onChange}
            />
          )}
        />
      )
    case 'pdf':
      return (
        <Controller
          control={control}
          name={field.name}
          render={({ field: controller }) => (
            <FileUrlField
              id={id}
              value={typeof controller.value === 'string' ? controller.value : ''}
              onChange={controller.onChange}
            />
          )}
        />
      )
    default:
      return (
        <Input
          type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
          placeholder={field.placeholder}
          autoComplete="off"
          {...a11y}
          {...register(field.name)}
        />
      )
  }
}

function FormPreview({
  control,
  fields,
  Preview,
}: {
  control: Control<FormValues>
  fields: FieldConfig[]
  Preview: ComponentType<PreviewProps>
}) {
  const values = useWatch({ control })
  return <Preview values={toPayload(fields, values as FormValues)} />
}

interface ResourceFormProps {
  /** Prefixo único para os ids dos campos. */
  formId: string
  fields: FieldConfig[]
  initialValues: FormValues
  submitLabel: string
  pending: boolean
  onSubmit: (payload: Record<string, unknown>) => void
  onCancel?: () => void
  Preview?: ComponentType<PreviewProps>
}

/**
 * Formulário gerado a partir da configuração de campos. O schema de validação
 * (Zod) vem da mesma configuração, então formulário e regras nunca divergem.
 */
export function ResourceForm({
  formId,
  fields,
  initialValues,
  submitLabel,
  pending,
  onSubmit,
  onCancel,
  Preview,
}: ResourceFormProps) {
  const [showPreview, setShowPreview] = useState(false)
  const schema = useMemo(() => buildSchema(fields), [fields])
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    // O schema é montado em tempo de execução; o tipo estático é o de FormValues.
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
    defaultValues: initialValues,
  })

  const submit = handleSubmit(
    (values) => onSubmit(toPayload(fields, values)),
    () => setShowPreview(false),
  )
  const hasErrors = Object.keys(errors).length > 0

  return (
    <form noValidate onSubmit={(event) => void submit(event)} className="flex flex-col gap-6">
      {Preview ? (
        <div role="group" aria-label="Modo de exibição" className="flex gap-2">
          {[
            { preview: false, label: 'Editar' },
            { preview: true, label: 'Pré-visualizar' },
          ].map((tab) => (
            <button
              key={tab.label}
              type="button"
              aria-pressed={showPreview === tab.preview}
              onClick={() => setShowPreview(tab.preview)}
              className={cn(
                'inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors',
                showPreview === tab.preview
                  ? 'border-accent/60 bg-accent/15 text-foreground'
                  : 'border-border text-muted hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : null}

      {Preview && showPreview ? (
        <div className="rounded-2xl border border-dashed border-border bg-background/60 p-4">
          <FormPreview control={control} fields={fields} Preview={Preview} />
        </div>
      ) : null}

      <div hidden={showPreview} className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
        {fields.map((field) => {
          const id = `${formId}-${field.name}`
          const error = firstMessage(errors[field.name])
          const wide = field.wide ?? ['textarea', 'list', 'screenshots', 'pdf'].includes(field.type)

          if (field.type === 'boolean') {
            return (
              <div
                key={field.name}
                className={cn(
                  'flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3',
                  wide && 'sm:col-span-2',
                )}
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{field.label}</p>
                  {field.hint ? <p className="mt-0.5 text-xs text-subtle">{field.hint}</p> : null}
                </div>
                <Controller
                  control={control}
                  name={field.name}
                  render={({ field: controller }) => (
                    <Switch
                      id={id}
                      label={field.label}
                      checked={controller.value === true}
                      onChange={controller.onChange}
                    />
                  )}
                />
              </div>
            )
          }

          return (
            <Field
              key={field.name}
              id={id}
              label={field.required ? `${field.label} *` : field.label}
              hint={field.hint ?? (field.type === 'list' ? 'Um item por linha.' : undefined)}
              error={error}
              className={cn(wide && 'sm:col-span-2')}
            >
              <FieldControl
                id={id}
                field={field}
                error={error}
                control={control}
                register={register}
              />
            </Field>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-5">
        {hasErrors ? (
          <p role="alert" className="mr-auto text-sm text-danger">
            Revise os campos destacados.
          </p>
        ) : null}
        {onCancel ? (
          <Button variant="secondary" disabled={pending} onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" disabled={pending || (!isDirty && !onCancel)}>
          {pending ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
