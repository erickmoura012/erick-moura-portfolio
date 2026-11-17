import type { GithubRepo } from '@shared/github'
import { ArrowUpRight, GitFork, Star } from 'lucide-react'
import { GithubIcon } from '@/components/common/BrandIcons'
import { ExternalLink } from '@/components/common/ExternalLink'
import { Button, type ButtonProps } from '@/components/ui/button'
import { languageColor } from '@/features/github/language-colors'
import { repoActivityDate } from '@/features/github/selectors'
import { useMessages } from '@/i18n'
import { cn, formatDate } from '@/lib/utils'
import type { Project } from '@/types/content'

interface ProjectLinksProps {
  project: Project
  size?: ButtonProps['size']
}

/** Botões de demonstração e código — cada um só aparece quando o link existe. */
export function ProjectLinks({ project, size = 'md' }: ProjectLinksProps) {
  const t = useMessages()
  return (
    <>
      {project.demoUrl ? (
        <Button asChild size={size}>
          <ExternalLink href={project.demoUrl} aria-label={t.projects.demoOf(project.title)}>
            {t.common.demo}
            <ArrowUpRight aria-hidden="true" />
          </ExternalLink>
        </Button>
      ) : null}
      {project.repoUrl ? (
        <Button asChild size={size} variant="secondary">
          <ExternalLink href={project.repoUrl} aria-label={t.projects.codeOf(project.title)}>
            <GithubIcon />
            {t.common.code}
          </ExternalLink>
        </Button>
      ) : null}
    </>
  )
}

interface RepoMetaProps {
  repo: GithubRepo
  className?: string
}

/** Linguagem, estrelas, forks e data de atualização vindos da API do GitHub. */
export function RepoMeta({ repo, className }: RepoMetaProps) {
  const t = useMessages()
  return (
    <ul
      className={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted', className)}
    >
      {repo.language ? (
        <li className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="size-2.5 rounded-full"
            style={{ backgroundColor: languageColor(repo.language) }}
          />
          {repo.language}
        </li>
      ) : null}
      <li className="inline-flex items-center gap-1 tabular-nums">
        <Star aria-hidden="true" className="size-3.5" />
        <span className="sr-only">{t.projects.stars(repo.stars)}</span>
        <span aria-hidden="true">{repo.stars}</span>
      </li>
      <li className="inline-flex items-center gap-1 tabular-nums">
        <GitFork aria-hidden="true" className="size-3.5" />
        <span className="sr-only">{t.projects.forks(repo.forks)}</span>
        <span aria-hidden="true">{repo.forks}</span>
      </li>
      <li>{t.projects.updatedOn(formatDate(repoActivityDate(repo)))}</li>
    </ul>
  )
}
