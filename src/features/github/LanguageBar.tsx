import { useMemo, useState } from 'react'
import { useMessages } from '@/i18n'
import { cn } from '@/lib/utils'
import { languageColor, OTHER_LANGUAGES_COLOR } from './language-colors'
import type { LanguageShare } from './selectors'

/** Fatias abaixo deste limite são somadas em "Outras" — seriam invisíveis na barra. */
const MIN_VISIBLE_SHARE = 0.01

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

function formatShare(share: number): string {
  return share > 0 && share < 0.001 ? '<0,1%' : percentFormatter.format(share)
}

interface Segment {
  name: string
  share: number
  color: string
}

interface LanguageBarProps {
  shares: LanguageShare[]
}

/** Barra segmentada (partes de um todo) com legenda que traz nome e valor de cada parte. */
export function LanguageBar({ shares }: LanguageBarProps) {
  const t = useMessages()
  const [highlighted, setHighlighted] = useState<string | null>(null)

  const segments = useMemo<Segment[]>(() => {
    const visible = shares.filter((item) => item.share >= MIN_VISIBLE_SHARE)
    const otherShare = shares
      .filter((item) => item.share < MIN_VISIBLE_SHARE)
      .reduce((sum, item) => sum + item.share, 0)

    const result = visible.map((item) => ({
      name: item.name,
      share: item.share,
      color: languageColor(item.name),
    }))
    if (otherShare > 0) {
      result.push({
        name: t.github.otherLanguages,
        share: otherShare,
        color: OTHER_LANGUAGES_COLOR,
      })
    }
    return result
  }, [shares, t])

  if (segments.length === 0) {
    return <p className="text-sm text-muted">{t.github.languagesEmpty}</p>
  }

  const summary = segments
    .map((segment) => `${segment.name} ${formatShare(segment.share)}`)
    .join(', ')

  return (
    <div>
      <div role="img" aria-label={summary} className="flex h-2 w-full gap-0.5">
        {segments.map((segment) => (
          <span
            key={segment.name}
            onPointerEnter={() => setHighlighted(segment.name)}
            onPointerLeave={() => setHighlighted(null)}
            style={{ flexGrow: segment.share, backgroundColor: segment.color }}
            className={cn(
              'min-w-1 basis-0 rounded-[1px] transition-opacity duration-200 first:rounded-l-full last:rounded-r-full',
              highlighted && highlighted !== segment.name && 'opacity-30',
            )}
          />
        ))}
      </div>

      <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2.5 min-[26rem]:grid-cols-2">
        {segments.map((segment) => (
          <li
            key={segment.name}
            onPointerEnter={() => setHighlighted(segment.name)}
            onPointerLeave={() => setHighlighted(null)}
            className={cn(
              'flex items-center gap-2.5 text-sm transition-opacity duration-200',
              highlighted && highlighted !== segment.name && 'opacity-50',
            )}
          >
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-[3px]"
              style={{ backgroundColor: segment.color }}
            />
            <span className="truncate text-foreground">{segment.name}</span>
            <span className="ml-auto text-muted tabular-nums">{formatShare(segment.share)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
