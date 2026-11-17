import type { GithubRepo } from '@shared/github'
import { ArrowUpRight, Search, SearchX } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { GithubIcon } from '@/components/common/BrandIcons'
import { ExternalLink } from '@/components/common/ExternalLink'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Label, Select } from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { useMessages } from '@/i18n'
import type { Project } from '@/types/content'
import { RepoMeta } from './ProjectLinks'
import {
  DEFAULT_REPO_FILTERS,
  filterRepos,
  REPO_SORTS,
  type RepoFilters,
  type RepoSort,
} from './repo-filters'

interface RepoCardProps {
  repo: GithubRepo
  /** Projeto em destaque correspondente, quando o repositório tem estudo publicado. */
  project: Project | null
}

function RepoCard({ repo, project }: RepoCardProps) {
  const t = useMessages()

  return (
    <Card interactive className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h4 className="min-w-0 text-base font-semibold">
          <ExternalLink
            href={repo.htmlUrl}
            className="inline-flex max-w-full items-center gap-1.5 font-mono text-[0.9375rem] text-foreground transition-colors hover:text-electric"
          >
            <GithubIcon className="size-4 shrink-0" />
            <span className="truncate">{repo.name}</span>
          </ExternalLink>
        </h4>
        <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
          {project ? <Badge variant="cyan">{t.projects.featuredBadge}</Badge> : null}
          {repo.isArchived ? <Badge variant="warning">{t.projects.archived}</Badge> : null}
          {repo.isFork ? <Badge>{t.projects.fork}</Badge> : null}
        </div>
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
        {repo.description ?? project?.tagline ?? t.projects.noDescription}
      </p>

      {repo.topics.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-cyan">
          {repo.topics.slice(0, 5).map((topic) => (
            <li key={topic}>#{topic}</li>
          ))}
        </ul>
      ) : null}

      <RepoMeta repo={repo} className="mt-4" />

      {repo.homepage || project ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border pt-3 text-sm">
          {repo.homepage ? (
            <ExternalLink
              href={repo.homepage}
              aria-label={t.projects.demoOf(repo.name)}
              className="inline-flex h-9 items-center gap-1 font-medium text-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-electric"
            >
              {t.common.demo}
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </ExternalLink>
          ) : null}
          {project ? (
            <Link
              to={`/projetos/${project.slug}`}
              aria-label={t.projects.caseStudyOf(project.title)}
              className="inline-flex h-9 items-center font-medium text-muted transition-colors hover:text-foreground"
            >
              {t.projects.caseStudy}
            </Link>
          ) : null}
        </div>
      ) : null}
    </Card>
  )
}

interface RepoExplorerProps {
  repos: GithubRepo[]
  languages: string[]
  featured: Project[]
  profileUrl: string
  isLoading: boolean
}

/** Lista de todos os repositórios públicos, com busca, filtro por linguagem e ordenação. */
export function RepoExplorer({
  repos,
  languages,
  featured,
  profileUrl,
  isLoading,
}: RepoExplorerProps) {
  const t = useMessages()
  const ids = useId()
  const [filters, setFilters] = useState<RepoFilters>(DEFAULT_REPO_FILTERS)

  const visible = useMemo(() => filterRepos(repos, filters), [repos, filters])
  const projectByRepo = useMemo(
    () =>
      new Map(
        featured.flatMap((project) =>
          project.repoName ? [[project.repoName.toLowerCase(), project] as const] : [],
        ),
      ),
    [featured],
  )
  const hasActiveFilters = filters.query !== '' || filters.language !== ''

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-foreground">{t.projects.explorerTitle}</h3>
          <p className="mt-1 text-sm text-muted">{t.projects.explorerDescription}</p>
        </div>
        <Button asChild variant="secondary" size="sm">
          <ExternalLink href={profileUrl}>
            <GithubIcon />
            {t.projects.viewProfile}
          </ExternalLink>
        </Button>
      </div>

      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]"
      >
        <div className="relative">
          <Label htmlFor={`${ids}-busca`} className="sr-only">
            {t.projects.searchLabel}
          </Label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-subtle"
          />
          <Input
            id={`${ids}-busca`}
            type="search"
            value={filters.query}
            onChange={(event) =>
              setFilters((current) => ({ ...current, query: event.target.value }))
            }
            placeholder={t.projects.searchPlaceholder}
            autoComplete="off"
            className="pl-11"
          />
        </div>
        <div>
          <Label htmlFor={`${ids}-linguagem`} className="sr-only">
            {t.projects.languageLabel}
          </Label>
          <Select
            id={`${ids}-linguagem`}
            value={filters.language}
            onChange={(event) =>
              setFilters((current) => ({ ...current, language: event.target.value }))
            }
            className="sm:w-52"
          >
            <option value="">{t.projects.allLanguages}</option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor={`${ids}-ordem`} className="sr-only">
            {t.projects.sortLabel}
          </Label>
          <Select
            id={`${ids}-ordem`}
            value={filters.sort}
            onChange={(event) =>
              setFilters((current) => ({ ...current, sort: event.target.value as RepoSort }))
            }
            className="sm:w-60"
          >
            {REPO_SORTS.map((sort) => (
              <option key={sort} value={sort}>
                {t.projects.sort[sort]}
              </option>
            ))}
          </Select>
        </div>
      </form>

      <p aria-live="polite" className="mb-4 font-mono text-xs text-subtle">
        {isLoading ? t.common.loading : t.projects.resultCount(visible.length)}
      </p>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-48 rounded-card" />
          ))}
        </div>
      ) : visible.length > 0 ? (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((repo) => (
            <li key={repo.id}>
              <RepoCard repo={repo} project={projectByRepo.get(repo.name.toLowerCase()) ?? null} />
            </li>
          ))}
        </ul>
      ) : (
        <Card className="flex flex-col items-center gap-4 px-6 py-12 text-center">
          <SearchX aria-hidden="true" className="size-8 text-subtle" />
          <p className="text-muted">{t.projects.empty}</p>
          {hasActiveFilters ? (
            <Button variant="secondary" size="sm" onClick={() => setFilters(DEFAULT_REPO_FILTERS)}>
              {t.projects.clearFilters}
            </Button>
          ) : null}
        </Card>
      )}
    </div>
  )
}
