import type { GithubActivity } from '@shared/github'
import { useState, type KeyboardEvent } from 'react'
import { useMessages } from '@/i18n'
import { cn, formatDate } from '@/lib/utils'
import { niceAxisMax } from './chart-scale'

const shortDate = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  timeZone: 'UTC',
})

interface ActivityChartProps {
  activity: GithubActivity
}

/** Colunas de eventos públicos por dia: uma série, um eixo, valores também em tabela. */
export function ActivityChart({ activity }: ActivityChartProps) {
  const t = useMessages()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const { days } = activity
  const peak = Math.max(...days.map((day) => day.count), 0)
  const axisMax = niceAxisMax(peak)
  const ticks = axisMax % 2 === 0 ? [axisMax, axisMax / 2, 0] : [axisMax, 0]
  const active = activeIndex === null ? null : (days[activeIndex] ?? null)
  const labelIndexes = new Set([0, Math.floor((days.length - 1) / 2), days.length - 1])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = days.length - 1
    const current = activeIndex ?? -1
    const next =
      event.key === 'ArrowRight'
        ? Math.min(last, current + 1)
        : event.key === 'ArrowLeft'
          ? Math.max(0, current === -1 ? last : current - 1)
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null
    if (next === null) return
    event.preventDefault()
    setActiveIndex(next)
  }

  return (
    <div>
      <div className="flex gap-3">
        <div
          aria-hidden="true"
          className="flex h-36 flex-col justify-between text-right text-[0.6875rem] leading-none text-subtle tabular-nums"
        >
          {ticks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex flex-col justify-between"
          >
            {ticks.map((tick) => (
              <span key={tick} className="h-px w-full bg-[var(--chart-grid)]" />
            ))}
          </div>

          <div
            role="group"
            tabIndex={0}
            aria-label={`${t.github.activityTitle}. ${t.github.activityKeyboardHint}`}
            onKeyDown={onKeyDown}
            onBlur={() => setActiveIndex(null)}
            onPointerLeave={() => setActiveIndex(null)}
            className="relative flex h-36 items-stretch rounded-md"
          >
            {days.map((day, index) => (
              <div
                key={day.date}
                onPointerEnter={() => setActiveIndex(index)}
                className="flex min-w-0 flex-1 items-end justify-center px-px"
              >
                {day.count > 0 ? (
                  <span
                    style={{ height: `${(day.count / axisMax) * 100}%` }}
                    className={cn(
                      'min-h-0.5 w-full max-w-6 rounded-t-[4px] bg-[var(--series-blue)] transition-[filter,opacity] duration-150',
                      activeIndex !== null && activeIndex !== index && 'opacity-45',
                      activeIndex === index && 'brightness-125',
                    )}
                  />
                ) : null}
              </div>
            ))}

            {active && activeIndex !== null ? (
              <div
                role="status"
                style={{ left: `${((activeIndex + 0.5) / days.length) * 100}%` }}
                className={cn(
                  'pointer-events-none absolute -top-2 z-10 -translate-y-full rounded-lg border border-border-strong bg-background-alt px-3 py-2 whitespace-nowrap shadow-float',
                  activeIndex < days.length * 0.2
                    ? 'translate-x-0'
                    : activeIndex > days.length * 0.8
                      ? '-translate-x-full'
                      : '-translate-x-1/2',
                )}
              >
                <p className="text-sm font-semibold text-foreground tabular-nums">{active.count}</p>
                <p className="text-xs text-muted">
                  {t.github.activityDayLabel(active.count, formatDate(active.date))}
                </p>
              </div>
            ) : null}
          </div>

          <div
            aria-hidden="true"
            className="relative mt-2 h-4 text-[0.6875rem] text-subtle tabular-nums"
          >
            {days.map((day, index) =>
              labelIndexes.has(index) ? (
                <span
                  key={day.date}
                  style={{ left: `${((index + 0.5) / days.length) * 100}%` }}
                  className={cn(
                    'absolute top-0',
                    index === 0
                      ? 'translate-x-0'
                      : index === days.length - 1
                        ? '-translate-x-full'
                        : '-translate-x-1/2',
                  )}
                >
                  {shortDate.format(new Date(`${day.date}T00:00:00Z`))}
                </span>
              ) : null,
            )}
          </div>
        </div>
      </div>

      <table className="sr-only">
        <caption>{t.github.activityTitle}</caption>
        <thead>
          <tr>
            <th scope="col">{t.github.tableDate}</th>
            <th scope="col">{t.github.tableEvents}</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.date}>
              <td>{formatDate(day.date)}</td>
              <td>{day.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
