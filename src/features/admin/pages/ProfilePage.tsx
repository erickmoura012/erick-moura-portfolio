import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Info } from 'lucide-react'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { staticContent } from '@/content'
import { keysToCamel, keysToSnake } from '@/lib/utils'
import { ErrorState, PageHeader } from '../components/PageStates'
import {
  ADMIN_LOCALE,
  adminKeys,
  describeError,
  publicContentKey,
  requireSupabase,
} from '../lib/client'
import { profileFields } from '../resources/configs'
import { ResourceForm } from '../resources/ResourceForm'
import { toFormValues } from '../resources/schema'

/** `null` quando o perfil ainda não foi salvo no banco. */
async function loadProfile(): Promise<Record<string, unknown> | null> {
  const supabase = await requireSupabase()
  const { data, error } = await supabase
    .from('profile_settings')
    .select('*')
    .eq('locale', ADMIN_LOCALE)
    .maybeSingle()
  if (error) throw error
  return data ? keysToCamel<Record<string, unknown>>(data as Record<string, unknown>) : null
}

async function saveProfile(values: Record<string, unknown>): Promise<void> {
  const supabase = await requireSupabase()
  const { error } = await supabase
    .from('profile_settings')
    .upsert({ ...keysToSnake(values), locale: ADMIN_LOCALE }, { onConflict: 'locale' })
  if (error) throw error
}

export function ProfilePage() {
  const queryClient = useQueryClient()
  const profile = useQuery({ queryKey: adminKeys.profile, queryFn: loadProfile })

  const save = useMutation({
    mutationFn: saveProfile,
    onSuccess: async () => {
      toast.success('Perfil atualizado.')
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminKeys.profile }),
        queryClient.invalidateQueries({ queryKey: publicContentKey }),
      ])
    },
    onError: (error) => toast.error(describeError(error)),
  })

  const isStored = profile.data !== null && profile.data !== undefined
  const initialValues = useMemo(() => {
    if (profile.data === undefined) return null
    const source = profile.data ?? { ...staticContent[ADMIN_LOCALE].profile }
    return toFormValues(profileFields, source)
  }, [profile.data])

  return (
    <div>
      <PageHeader
        title="Perfil e links"
        description="Apresentação, redes sociais, e-mail público e currículo."
      />

      {profile.isPending ? (
        <div role="status" aria-label="Carregando" className="flex flex-col gap-4">
          <Skeleton className="h-12 rounded-md" />
          <Skeleton className="h-40 rounded-md" />
          <Skeleton className="h-12 rounded-md" />
        </div>
      ) : profile.isError || !initialValues ? (
        <ErrorState message={describeError(profile.error)} onRetry={() => void profile.refetch()} />
      ) : (
        <>
          {isStored ? null : (
            <p
              role="status"
              className="mb-5 flex items-start gap-2.5 rounded-md border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-foreground"
            >
              <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />O perfil
              ainda não foi salvo no banco. Os campos abaixo trazem o conteúdo estático do site; ao
              salvar, o banco passa a ser a fonte.
            </p>
          )}
          <Card className="p-5 sm:p-8">
            <ResourceForm
              // Remonta após cada salvamento para que o formulário parta dos dados gravados.
              key={profile.dataUpdatedAt}
              formId="perfil"
              fields={profileFields}
              initialValues={initialValues}
              submitLabel="Salvar perfil"
              pending={save.isPending}
              onSubmit={(values) => save.mutate(values)}
            />
          </Card>
        </>
      )}
    </div>
  )
}
