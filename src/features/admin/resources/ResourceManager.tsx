import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState, ErrorState, PageHeader } from '../components/PageStates'
import { Switch } from '../components/Switch'
import { adminKeys, describeError, publicContentKey } from '../lib/client'
import { deleteRow, listRows, patchRow, saveRow } from './api'
import { ResourceForm } from './ResourceForm'
import { toFormValues } from './schema'
import type { FieldConfig, ResourceConfig, ResourceRow } from './types'

/** Presentes em todo recurso: ordem de exibição e publicação. */
const COMMON_FIELDS: FieldConfig[] = [
  {
    name: 'sortOrder',
    label: 'Ordem de exibição',
    type: 'number',
    hint: 'Números menores aparecem primeiro.',
  },
  {
    name: 'published',
    label: 'Publicado',
    type: 'boolean',
    hint: 'Itens não publicados ficam visíveis só no painel.',
    defaultValue: true,
  },
]

type Editing = { mode: 'create' } | { mode: 'edit'; row: ResourceRow } | null

/**
 * Listagem + criação, edição e exclusão para qualquer tabela de conteúdo,
 * dirigida por um `ResourceConfig`. Projetos, skills, experiências e formação
 * usam este mesmo componente.
 */
export function ResourceManager({ config }: { config: ResourceConfig }) {
  const queryClient = useQueryClient()
  const queryKey = adminKeys.resource(config.table)
  const [editing, setEditing] = useState<Editing>(null)
  const [deleting, setDeleting] = useState<ResourceRow | null>(null)

  const fields = useMemo(() => [...config.fields, ...COMMON_FIELDS], [config.fields])
  const newLabel = `${config.gender === 'f' ? 'Nova' : 'Novo'} ${config.singular}`

  const list = useQuery({ queryKey, queryFn: () => listRows(config.table) })
  const rows = useMemo(() => list.data ?? [], [list.data])

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey }),
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard }),
      queryClient.invalidateQueries({ queryKey: publicContentKey }),
    ])
  }

  const save = useMutation({
    mutationFn: ({ id, values }: { id: string | null; values: Record<string, unknown> }) =>
      saveRow(config.table, id, values),
    onSuccess: async () => {
      setEditing(null)
      toast.success('Alterações salvas.')
      await refresh()
    },
    onError: (error) => toast.error(describeError(error)),
  })

  const toggle = useMutation({
    mutationFn: ({ id, field, value }: { id: string; field: string; value: boolean }) =>
      patchRow(config.table, id, { [field]: value }),
    onSuccess: refresh,
    onError: (error) => toast.error(describeError(error)),
  })

  const remove = useMutation({
    mutationFn: (id: string) => deleteRow(config.table, id),
    onSuccess: async () => {
      setDeleting(null)
      toast.success('Registro excluído.')
      await refresh()
    },
    onError: (error) => toast.error(describeError(error)),
  })

  const initialValues = useMemo(() => {
    if (!editing) return null
    if (editing.mode === 'edit') return toFormValues(fields, editing.row)
    const nextOrder = rows.reduce((max, row) => Math.max(max, row.sortOrder), 0) + 1
    return { ...toFormValues(fields, null), sortOrder: nextOrder }
  }, [editing, fields, rows])

  const toggles = [{ field: 'published', label: 'Publicado' }, ...(config.toggles ?? [])]

  return (
    <div>
      <PageHeader
        title={config.title}
        description={config.description}
        actions={
          <Button onClick={() => setEditing({ mode: 'create' })}>
            <Plus aria-hidden="true" />
            {newLabel}
          </Button>
        }
      />

      {list.isPending ? (
        <div role="status" aria-label="Carregando" className="flex flex-col gap-3">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-16 rounded-lg" />
          ))}
        </div>
      ) : list.isError ? (
        <ErrorState message={describeError(list.error)} onRetry={() => void list.refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState
          title={`Nenhum registro em ${config.title.toLowerCase()}.`}
          description="Enquanto a tabela estiver vazia, o site exibe o conteúdo estático versionado no código."
          action={
            <Button variant="secondary" size="sm" onClick={() => setEditing({ mode: 'create' })}>
              <Plus aria-hidden="true" />
              {newLabel}
            </Button>
          }
        />
      ) : (
        <Card className="scrollbar-thin overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <caption className="sr-only">{config.title}</caption>
            <thead className="border-b border-border font-mono text-xs tracking-wider text-subtle uppercase">
              <tr>
                <th scope="col" className="px-5 py-3 font-normal">
                  {config.singular}
                </th>
                <th scope="col" className="px-3 py-3 font-normal">
                  Ordem
                </th>
                {toggles.map((item) => (
                  <th key={item.field} scope="col" className="px-3 py-3 font-normal">
                    {item.label}
                  </th>
                ))}
                <th scope="col" className="px-5 py-3 text-right font-normal">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const title = config.rowTitle(row)
                return (
                  <tr key={row.id} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-foreground">{title}</span>
                        {config.badges?.(row).map((badge) => (
                          <Badge key={badge.label} variant={badge.variant}>
                            {badge.label}
                          </Badge>
                        ))}
                      </div>
                      {config.rowSubtitle ? (
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                          {config.rowSubtitle(row)}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-3 py-3.5 text-muted tabular-nums">{row.sortOrder}</td>
                    {toggles.map((item) => (
                      <td key={item.field} className="px-3 py-3.5">
                        <Switch
                          label={`${item.label}: ${title}`}
                          checked={row[item.field] === true}
                          disabled={toggle.isPending}
                          onChange={(value) =>
                            toggle.mutate({ id: row.id, field: item.field, value })
                          }
                        />
                      </td>
                    ))}
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Editar ${title}`}
                          onClick={() => setEditing({ mode: 'edit', row })}
                        >
                          <Pencil aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Excluir ${title}`}
                          onClick={() => setDeleting(row)}
                        >
                          <Trash2 aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      )}

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open && !save.isPending) setEditing(null)
        }}
      >
        {editing && initialValues ? (
          <DialogContent className="max-w-3xl">
            <DialogTitle className="pr-10 text-xl font-semibold text-foreground">
              {editing.mode === 'create' ? newLabel : `Editar ${config.rowTitle(editing.row)}`}
            </DialogTitle>
            <DialogDescription className="mt-1 mb-6 text-sm text-muted">
              Campos com * são obrigatórios.
            </DialogDescription>
            <ResourceForm
              key={editing.mode === 'edit' ? editing.row.id : 'novo'}
              formId={`${config.table}-form`}
              fields={fields}
              initialValues={initialValues}
              submitLabel={editing.mode === 'create' ? 'Criar' : 'Salvar alterações'}
              pending={save.isPending}
              Preview={config.Preview}
              onCancel={() => setEditing(null)}
              onSubmit={(values) =>
                save.mutate({ id: editing.mode === 'edit' ? editing.row.id : null, values })
              }
            />
          </DialogContent>
        ) : null}
      </Dialog>

      <ConfirmDialog
        open={deleting !== null}
        title={`Excluir ${config.singular}?`}
        description={
          deleting ? (
            <>
              <strong className="text-foreground">{config.rowTitle(deleting)}</strong> será removido
              permanentemente. Esta ação não pode ser desfeita.
            </>
          ) : null
        }
        confirmLabel="Excluir"
        pending={remove.isPending}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) remove.mutate(deleting.id)
        }}
      />
    </div>
  )
}
