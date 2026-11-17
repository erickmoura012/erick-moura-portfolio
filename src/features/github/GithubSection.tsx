import type { GithubData, GithubRepo } from '@shared/github'
import { ArrowUpRight, CircleAlert, GitCommitHorizontal, RefreshCw, Star } from 'lucide-react'
import type { ReactNode } from 'react'
import { SECTION_IDS } from '@/app/sections'
import { Reveal } from '@/components/animations/Reveal'
import { GithubIcon } from '@/components/common/BrandIcons'
import { ExternalLink } from '@/components/common/ExternalLink'
import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePortfolioContent } from '@/hooks/use-portfolio-content'
import { useMessages } from '@/i18n'
import { cn, formatDate, formatDateTime, formatNumber } from '@/lib/utils'
import { ActivityChart } from './ActivityChart'
import { ContributionHeatmap } from './ContributionHeatmap'
import { LanguageBar } from './LanguageBar'
import { languageColor } from './language-colors'
import { repoActivityDate, selectLanguageShares, selectRecentRepos } from './selectors'
import { useGithubData } from './use-github-data'

function Panel({
  title,
  hint,
  className,
  children,
}: {
  title: string
  hint?: string
  className?: string
  children: ReactNode
}) {
  return (
    <Card className={cn('flex flex-col p-5 sm:p-6', className)}>
      <h3 className="label-mono font-normal text-subtle">{title}</h3>
      {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
      <div className="mt-5 flex-1">{children}</div>
    </Card>
  )
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-5">
      <p className="label-mono text-subtle">{label}</p>
      <p className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground tabular-nums">
        {formatNumber(value)}
      </p>
    </Card>
  )
}

function RecentRepoRow({ repo }: { repo: GithubRepo }) {
  const t = useMessages()
  return (
    <li className="flex items-center gap-4 border-b border-border py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <ExternalLink
          href={repo.htmlUrl}
          className="inline-flex max-w-full items-center gap-1 font-mono text-sm text-foreground transition-colors hover:text-electric"
        >
          <span className="truncate">{repo.name}</span>
          <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
        </ExternalLink>
        <p className="mt-0.5 text-xs text-subtle">
          {t.projects.updatedOn(formatDate(repoActivityDate(repo)))}
        </p>
      </div>
      {repo.language ? (
        <span className="hidden items-center gap-1.5 text-xs text-muted sm:inline-flex">
          <span
            aria-hidden="true"
            className="size-2.5 rounded-full"
            style={{ backgroundColor: languageColor(repo.language) }}
          />
          {repo.language}
        </span>
      ) : null}
      <span className="inline-flex w-10 items-center justify-end gap-1 text-xs text-muted tabular-nums">
        <Star aria-hidden="true" className="size-3.5" />
        <span className="sr-only">{t.projects.stars(repo.stars)}</span>
        <span aria-hidden="true">{repo.stars}</span>
      </span>
    </li>
  )
}

function Dashboard({ data }: { data: GithubData }) {
  const t = useMessages()
  const languages = selectLanguageShares(data)
  const recentRepos = selectRecentRepos(data)
  const { user, activity, contributions } = data

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="grid grid-cols-2 gap-4 lg:col-span-12 lg:grid-cols-4">
        <StatTile label={t.github.stats.repos} value={user.publicRepos} />
        <StatTile label={t.github.stats.languages} value={languages.length} />
        <StatTile label={t.github.stats.events} value={activity?.total ?? 0} />
        <StatTile label={t.github.stats.followers} value={user.followers} />
      </div>

      <Panel
        title={t.github.languagesTitle}
        hint={t.github.languagesHint}
        className="lg:col-span-5"
      >
        <LanguageBar shares={languages} />
      </Panel>

      <Panel
        title={t.github.activityTitle}
        hint={
          activity
            ? t.github.activitySummary(
                activity.total,
                formatDate(activity.from),
                formatDate(activity.to),
              )
            : undefined
        }
        className="lg:col-span-7"
      >
        {activity ? (
          <ActivityChart activity={activity} />
        ) : (
          <p className="text-sm text-muted">{t.github.activityEmpty}</p>
        )}
      </Panel>

      <Panel title={t.github.contributionsTitle} className="lg:col-span-12">
        {contributions ? (
          <ContributionHeatmap contributions={contributions} />
        ) : (
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-relaxed text-muted">
              {t.github.contributionsUnavailable}
            </p>
            <Button asChild variant="secondary" size="sm" className="shrink-0">
              <ExternalLink href={user.htmlUrl}>
                {t.github.contributionsCta}
                <ArrowUpRight aria-hidden="true" />
              </ExternalLink>
            </Button>
          </div>
        )}
      </Panel>

      <Panel title={t.github.recentTitle} className="lg:col-span-7">
        <ul className="-my-3">
          {recentRepos.map((repo) => (
            <RecentRepoRow key={repo.id} repo={repo} />
          ))}
        </ul>
      </Panel>

      <Card className="flex flex-col justify-between gap-6 p-5 sm:p-6 lg:col-span-5">
        <div className="flex items-start gap-4">
          <img
            src={`${user.avatarUrl}${user.avatarUrl.includes('?') ? '&' : '?'}s=160`}
            alt={t.github.profileAlt(user.name ?? user.login)}
            width={64}
            height={64}
            loading="lazy"
            decoding="async"
            className="size-16 shrink-0 rounded-lg border border-border-strong object-cover"
          />
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{user.name ?? user.login}</p>
            <p className="font-mono text-sm text-muted">@{user.login}</p>
            <p className="mt-1 text-xs text-subtle">
              {t.github.memberSince(formatDate(user.createdAt))}
            </p>
          </div>
        </div>
        {user.bio ? <p className="text-sm leading-relaxed text-muted">{user.bio}</p> : null}
        <Button asChild variant="secondary" className="self-start">
          <ExternalLink href={user.htmlUrl}>
            <GitCommitHorizontal aria-hidden="true" />
            {t.github.followCommits}
          </ExternalLink>
        </Button>
      </Card>
    </div>
  )
}

function DashboardSkeleton() {
  const t = useMessages()
  return (
    <div role="status" aria-label={t.common.loading} className="grid gap-4 lg:grid-cols-12">
      <div className="grid grid-cols-2 gap-4 lg:col-span-12 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-28 rounded-card" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-card lg:col-span-5" />
      <Skeleton className="h-64 rounded-card lg:col-span-7" />
      <Skeleton className="h-40 rounded-card lg:col-span-12" />
    </div>
  )
}

export function GithubSection() {
  const t = useMessages()
  const { profile } = usePortfolioContent()
  const { result, isLoading, isError, isRefreshing, refetch } = useGithubData()

  return (
    <Section
      id={SECTION_IDS.github}
      index={6}
      eyebrow={t.github.eyebrow}
      title={t.github.title}
      highlight={t.github.titleHighlight}
      description={t.github.description}
    >
      <Reveal>
        {isLoading ? <DashboardSkeleton /> : null}

        {isError ? (
          <Card role="alert" className="flex flex-col items-start gap-4 p-6 sm:p-8">
            <CircleAlert aria-hidden="true" className="size-6 text-warning" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">{t.github.errorTitle}</h3>
              <p className="mt-1 text-sm text-muted">{t.github.errorDescription}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="sm" onClick={() => void refetch()}>
                <RefreshCw aria-hidden="true" />
                {t.github.retry}
              </Button>
              <Button asChild variant="ghost" size="sm">
                <ExternalLink href={profile.githubUrl}>
                  <GithubIcon />
                  GitHub
                </ExternalLink>
              </Button>
            </div>
          </Card>
        ) : null}

        {result ? (
          <>
            {result.notice ? (
              <p
                role="status"
                className="mb-4 flex items-start gap-2.5 rounded-md border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-foreground"
              >
                <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-warning" />
                {t.github.notices[result.notice]}
              </p>
            ) : null}
            <div className={cn('transition-opacity duration-300', isRefreshing && 'opacity-80')}>
              <Dashboard data={result.data} />
            </div>
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-subtle">
              <span>{t.github.syncedAt(formatDateTime(result.data.syncedAt))}</span>
              {isRefreshing ? (
                <span role="status" className="inline-flex items-center gap-1.5">
                  <RefreshCw aria-hidden="true" className="size-3 animate-spin" />
                  {t.github.refreshing}
                </span>
              ) : null}
            </p>
          </>
        ) : null}
      </Reveal>
    </Section>
  )
}
