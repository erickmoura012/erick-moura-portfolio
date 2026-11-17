import type { GithubContributions } from '@shared/github'
import { useState, type PointerEvent } from 'react'
import { useMessages } from '@/i18n'
import { formatDate, formatNumber } from '@/lib/utils'

const CELL = 11
const GAP = 3
const STEP = CELL + GAP
const LEFT = 30
const TOP = 18
const WEEKDAY_LABELS: Record<number, string> = { 1: 'seg', 3: 'qua', 5: 'sex' }
const LEVELS = [0, 1, 2, 3, 4] as const

const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' })
const utcDate = (date: string) => new Date(`${date}T00:00:00Z`)

interface HoveredCell {
  x: number
  y: number
  count: number
  date: string
}

interface ContributionHeatmapProps {
  contributions: GithubContributions
}

/**
 * Calendário de contribuições: rampa sequencial de um único matiz, em que o
 * nível zero recua para a superfície. Os dados vêm da API GraphQL do GitHub.
 */
export function ContributionHeatmap({ contributions }: ContributionHeatmapProps) {
  const t = useMessages()
  const [hovered, setHovered] = useState<HoveredCell | null>(null)

  const { weeks, total } = contributions
  const width = LEFT + weeks.length * STEP
  const height = TOP + 7 * STEP

  const monthLabels = weeks.flatMap((week, index) => {
    const first = week[0]
    if (!first) return []
    const month = utcDate(first.date).getUTCMonth()
    const previous = weeks[index - 1]?.[0]
    if (previous && utcDate(previous.date).getUTCMonth() === month) return []
    return [{ index, label: monthFormatter.format(utcDate(first.date)).replace('.', '') }]
  })

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const target = event.target as SVGElement
    const { date, count } = target.dataset
    if (!date || count === undefined) {
      setHovered(null)
      return
    }
    const bounds = event.currentTarget.getBoundingClientRect()
    const cell = target.getBoundingClientRect()
    setHovered({
      x: cell.left - bounds.left + cell.width / 2,
      y: cell.top - bounds.top,
      count: Number(count),
      date,
    })
  }

  return (
    <div>
      <div className="scrollbar-thin overflow-x-auto pb-2">
        <div className="relative w-max">
          <svg
            role="img"
            aria-label={t.github.contributionsTotal(total)}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            onPointerMove={onPointerMove}
            onPointerLeave={() => setHovered(null)}
          >
            {monthLabels.map(({ index, label }) => (
              <text
                key={`${label}-${index}`}
                x={LEFT + index * STEP}
                y={10}
                fill="var(--subtle)"
                fontSize="10"
              >
                {label}
              </text>
            ))}
            {Object.entries(WEEKDAY_LABELS).map(([day, label]) => (
              <text
                key={day}
                x={0}
                y={TOP + Number(day) * STEP + CELL - 2}
                fill="var(--subtle)"
                fontSize="10"
              >
                {label}
              </text>
            ))}
            {weeks.map((week, weekIndex) =>
              week.map((day) => (
                <rect
                  key={day.date}
                  x={LEFT + weekIndex * STEP}
                  y={TOP + utcDate(day.date).getUTCDay() * STEP}
                  width={CELL}
                  height={CELL}
                  rx={2.5}
                  fill={`var(--seq-${day.level})`}
                  data-date={day.date}
                  data-count={day.count}
                />
              )),
            )}
          </svg>

          {hovered ? (
            <div
              role="status"
              style={{ left: hovered.x, top: hovered.y - 6 }}
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-border-strong bg-background-alt px-3 py-2 whitespace-nowrap shadow-float"
            >
              <p className="text-sm font-semibold text-foreground tabular-nums">{hovered.count}</p>
              <p className="text-xs text-muted">
                {t.github.contributionsDayLabel(hovered.count, formatDate(hovered.date))}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          <span className="font-semibold text-foreground tabular-nums">{formatNumber(total)}</span>{' '}
          {t.github.contributionsTotalLabel(total)}
        </p>
        <p aria-hidden="true" className="flex items-center gap-1.5 text-xs text-subtle">
          {t.github.less}
          {LEVELS.map((level) => (
            <span
              key={level}
              className="size-[11px] rounded-[2.5px]"
              style={{ backgroundColor: `var(--seq-${level})` }}
            />
          ))}
          {t.github.more}
        </p>
      </div>
    </div>
  )
}
