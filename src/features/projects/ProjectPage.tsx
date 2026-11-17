import { ArrowLeft, Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { SECTION_IDS } from '@/app/sections'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { selectProjectRepos } from '@/features/github/selectors'
import { useGithubData } from '@/features/github/use-github-data'
import { useFeaturedProjects } from '@/hooks/use-portfolio-content'
import { usePageMeta } from '@/hooks/use-page-meta'
import { useMessages } from '@/i18n'
import type { Project } from '@/types/content'
import { ProjectLinks, RepoMeta } from './ProjectLinks'
import { ProjectVisual, Screenshot } from './ProjectVisual'

function BackLink() {
  const t = useMessages()
  return (
    <Link
      to={{ pathname: '/', hash: `#${SECTION_IDS.projects}` }}
      className="inline-flex h-11 items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
    >
      <ArrowLeft aria-hidden="true" className="size-4" />
      {t.projects.page.back}
    </Link>
  )
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 font-mono text-xs font-normal tracking-wider text-cyan uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-relaxed text-muted">
          <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-cyan" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function ProjectDetails({ project }: { project: Project }) {
  const t = useMessages()
  const { result } = useGithubData()
  const repo =
    result && project.repoName
      ? (selectProjectRepos(result.data).find(
          (item) => item.name.toLowerCase() === project.repoName?.toLowerCase(),
        ) ?? null)
      : null
  const [, ...gallery] = project.screenshots

  usePageMeta(t.meta.projectTitle(project.title), project.description)

  return (
    <article className="container-page pt-28 pb-16 sm:pt-36">
      <BackLink />

      <header className="mt-6 grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
        <div>
          <p className="font-mono text-xs tracking-wider text-cyan uppercase">{project.tagline}</p>
          <h1 className="mt-3 text-4xl font-semibold text-foreground sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">{project.description}</p>
          {repo ? <RepoMeta repo={repo} className="mt-6" /> : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <ProjectLinks project={project} size="lg" />
          </div>
        </div>
        <ProjectVisual project={project} priority />
      </header>

      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        {project.challenge ? (
          <Card className="p-6 sm:p-8">
            <Block title={t.projects.page.challenge}>
              <p className="text-lg leading-relaxed text-foreground">{project.challenge}</p>
            </Block>
          </Card>
        ) : null}
        {project.solution ? (
          <Card className="p-6 sm:p-8">
            <Block title={t.projects.page.solution}>
              <p className="leading-relaxed text-muted">{project.solution}</p>
            </Block>
          </Card>
        ) : null}
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {project.features.length > 0 ? (
          <Block title={t.projects.page.features}>
            <BulletList items={project.features} />
          </Block>
        ) : null}

        <div className="flex flex-col gap-12">
          {project.architecture.length > 0 ? (
            <Block title={t.projects.page.architecture}>
              <ol className="flex flex-col gap-3 border-l border-border pl-5">
                {project.architecture.map((item) => (
                  <li key={item} className="font-mono text-sm leading-relaxed text-muted">
                    {item}
                  </li>
                ))}
              </ol>
            </Block>
          ) : null}
          {project.highlights.length > 0 ? (
            <Block title={t.projects.page.highlights}>
              <BulletList items={project.highlights} />
            </Block>
          ) : null}
          <Block title={t.projects.page.stack}>
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li key={tech}>
                  <Badge mono>{tech}</Badge>
                </li>
              ))}
            </ul>
          </Block>
        </div>
      </div>

      {gallery.length > 0 ? (
        <div className="mt-14">
          <Block title={t.projects.page.screenshots}>
            <ul className="grid gap-6 md:grid-cols-2">
              {gallery.map((screenshot) => (
                <li
                  key={screenshot.src}
                  className="overflow-hidden rounded-xl border border-border-strong shadow-card"
                >
                  <Screenshot screenshot={screenshot} />
                </li>
              ))}
            </ul>
          </Block>
        </div>
      ) : null}
    </article>
  )
}

function ProjectNotFound() {
  const t = useMessages()
  usePageMeta(t.meta.notFoundTitle)

  return (
    <div className="container-page flex min-h-[70dvh] flex-col items-start justify-center gap-4 pt-28">
      <p className="font-mono text-sm text-danger">404</p>
      <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
        {t.projects.page.notFoundTitle}
      </h1>
      <p className="text-muted">{t.projects.page.notFoundDescription}</p>
      <Button asChild variant="secondary" className="mt-2">
        <Link to={{ pathname: '/', hash: `#${SECTION_IDS.projects}` }}>
          <ArrowLeft aria-hidden="true" />
          {t.projects.page.back}
        </Link>
      </Button>
    </div>
  )
}

export function ProjectPage() {
  const { slug } = useParams()
  const { all } = useFeaturedProjects()
  const project = all.find((item) => item.slug === slug)

  return project ? <ProjectDetails key={project.id} project={project} /> : <ProjectNotFound />
}
