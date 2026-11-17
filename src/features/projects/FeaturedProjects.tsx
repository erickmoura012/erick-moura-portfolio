import type { GithubRepo } from '@shared/github'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Reveal } from '@/components/animations/Reveal'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useMessages } from '@/i18n'
import type { Project } from '@/types/content'
import { ProjectLinks, RepoMeta } from './ProjectLinks'
import { ProjectVisual } from './ProjectVisual'

interface ProjectProps {
  project: Project
  /** Dados ao vivo do repositório, quando já carregados. */
  repo: GithubRepo | null
}

function CaseStudyLink({ project, row = false }: { project: Project; row?: boolean }) {
  const t = useMessages()
  return (
    <Link
      to={`/projetos/${project.slug}`}
      aria-label={t.projects.caseStudyOf(project.title)}
      className={
        row
          ? 'group/link flex h-12 items-center justify-between gap-2 border-t border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover sm:px-6'
          : 'group/link inline-flex h-11 items-center gap-1.5 text-sm font-medium text-foreground underline decoration-border-strong underline-offset-[6px] transition-colors hover:decoration-electric'
      }
    >
      {t.projects.caseStudy}
      <ArrowRight
        aria-hidden="true"
        className="size-4 transition-transform duration-200 group-hover/link:translate-x-0.5"
      />
    </Link>
  )
}

/** Selo que diferencia projetos autorais de colaborações. */
export function RoleBadge({ project }: { project: Project }) {
  const t = useMessages()
  return project.role ? (
    <Badge variant="cyan" mono>
      {project.role}
    </Badge>
  ) : (
    <Badge mono>{t.projects.ownLabel}</Badge>
  )
}

/** Apresentação de destaque do projeto principal. */
export function PrimaryProject({ project, repo }: ProjectProps) {
  const t = useMessages()

  return (
    <Reveal>
      <Card className="grid overflow-hidden lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="flex flex-col p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent" mono>
              {t.projects.primaryLabel}
            </Badge>
            <RoleBadge project={project} />
          </div>
          <h3 className="mt-6 text-4xl font-semibold text-foreground sm:text-5xl">
            {project.title}
          </h3>
          <p className="mt-3 font-display text-lg text-foreground/80">{project.tagline}</p>
          <p className="mt-5 leading-relaxed text-muted">{project.description}</p>

          {project.highlights.length > 0 ? (
            <ul className="mt-6 border-t border-border">
              {project.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex gap-3 border-b border-border py-2.5 text-sm leading-relaxed text-muted"
                >
                  <span aria-hidden="true" className="mt-px font-mono text-xs text-electric">
                    →
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
          ) : null}

          <p className="mt-6 font-mono text-xs leading-relaxed text-subtle">
            <span className="sr-only">{t.projects.page.stack}: </span>
            {project.stack.join('  /  ')}
          </p>

          {repo ? <RepoMeta repo={repo} className="mt-4" /> : null}

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <ProjectLinks project={project} />
            <CaseStudyLink project={project} />
          </div>
        </div>

        <div className="flex items-center border-t border-border bg-background-alt/60 p-6 sm:p-10 lg:border-t-0 lg:border-l">
          <div className="crop-marks w-full">
            <ProjectVisual project={project} />
          </div>
        </div>
      </Card>
    </Reveal>
  )
}

export function ProjectCard({ project, repo }: ProjectProps) {
  const t = useMessages()

  return (
    <Card interactive className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-border bg-background-alt/60 p-4">
        <ProjectVisual project={project} sizes="(min-width: 1024px) 380px, calc(100vw - 4.5rem)" />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-2xl font-semibold text-foreground">{project.title}</h3>
          <RoleBadge project={project} />
        </div>
        <p className="mt-1.5 text-sm font-medium text-foreground/80">{project.tagline}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{project.description}</p>

        <p className="mt-5 font-mono text-xs leading-relaxed text-subtle">
          <span className="sr-only">{t.projects.page.stack}: </span>
          {project.stack.slice(0, 5).join('  /  ')}
        </p>

        {repo ? <RepoMeta repo={repo} className="mt-4" /> : null}

        {project.demoUrl || project.repoUrl ? (
          <div className="mt-5 flex flex-wrap items-center gap-2 [&>a]:flex-1">
            <ProjectLinks project={project} size="sm" />
          </div>
        ) : null}
      </div>
      <CaseStudyLink project={project} row />
    </Card>
  )
}
