import type { GithubRepo } from '@shared/github'
import { ArrowRight, Check } from 'lucide-react'
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

function CaseStudyLink({ project }: { project: Project }) {
  const t = useMessages()
  return (
    <Link
      to={`/projetos/${project.slug}`}
      aria-label={t.projects.caseStudyOf(project.title)}
      className="group/link inline-flex h-11 items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-foreground"
    >
      {t.projects.caseStudy}
      <ArrowRight
        aria-hidden="true"
        className="size-4 transition-transform duration-200 group-hover/link:translate-x-0.5"
      />
    </Link>
  )
}

/** Apresentação de destaque do projeto principal. */
export function PrimaryProject({ project, repo }: ProjectProps) {
  const t = useMessages()

  return (
    <Reveal>
      <Card className="grid overflow-hidden lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col p-6 sm:p-10">
          <Badge variant="cyan" mono className="self-start">
            {t.projects.primaryLabel}
          </Badge>
          <h3 className="mt-5 text-3xl font-semibold text-foreground sm:text-4xl">
            {project.title}
          </h3>
          <p className="mt-2 font-medium text-accent">{project.tagline}</p>
          <p className="mt-4 leading-relaxed text-muted">{project.description}</p>

          <ul className="mt-6 flex flex-col gap-2.5">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3 text-sm leading-relaxed text-muted">
                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-cyan" />
                {highlight}
              </li>
            ))}
          </ul>

          <ul aria-label={t.projects.page.stack} className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li key={tech}>
                <Badge mono>{tech}</Badge>
              </li>
            ))}
          </ul>

          {repo ? <RepoMeta repo={repo} className="mt-6" /> : null}

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
            <ProjectLinks project={project} />
            <span className="ml-1">
              <CaseStudyLink project={project} />
            </span>
          </div>
        </div>

        <div className="relative flex items-center border-t border-border bg-background-alt/50 p-6 sm:p-10 lg:border-t-0 lg:border-l">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(closest-side,var(--glow-blue),transparent)]"
          />
          <div className="relative w-full">
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
    <Card interactive className="group flex h-full flex-col p-6 sm:p-7">
      <div className="mb-6 transition-transform duration-500 group-hover:-translate-y-0.5">
        <ProjectVisual project={project} />
      </div>
      <h3 className="text-2xl font-semibold text-foreground">{project.title}</h3>
      <p className="mt-1.5 text-sm font-medium text-accent">{project.tagline}</p>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">{project.description}</p>

      <ul aria-label={t.projects.page.stack} className="mt-5 flex flex-wrap gap-2">
        {project.stack.slice(0, 6).map((tech) => (
          <li key={tech}>
            <Badge mono>{tech}</Badge>
          </li>
        ))}
      </ul>

      {repo ? <RepoMeta repo={repo} className="mt-5" /> : null}

      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-5">
        <ProjectLinks project={project} size="sm" />
        <span className="ml-auto">
          <CaseStudyLink project={project} />
        </span>
      </div>
    </Card>
  )
}
