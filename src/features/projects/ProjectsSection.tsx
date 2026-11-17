import type { GithubRepo } from '@shared/github'
import { useMemo } from 'react'
import { SECTION_IDS } from '@/app/sections'
import { Reveal } from '@/components/animations/Reveal'
import { Section } from '@/components/layout/Section'
import { selectPrimaryLanguages, selectProjectRepos } from '@/features/github/selectors'
import { useGithubData } from '@/features/github/use-github-data'
import { useFeaturedProjects, usePortfolioContent } from '@/hooks/use-portfolio-content'
import { useMessages } from '@/i18n'
import { PrimaryProject, ProjectCard } from './FeaturedProjects'
import { RepoExplorer } from './RepoExplorer'

export function ProjectsSection() {
  const t = useMessages()
  const { profile } = usePortfolioContent()
  const { primary, others, all } = useFeaturedProjects()
  const { result, isLoading } = useGithubData()

  const data = result?.data ?? null
  const repos = useMemo(() => (data ? selectProjectRepos(data) : []), [data])
  const languages = useMemo(() => (data ? selectPrimaryLanguages(data) : []), [data])
  const repoByName = useMemo(
    () => new Map(repos.map((repo) => [repo.name.toLowerCase(), repo] as const)),
    [repos],
  )
  const findRepo = (repoName: string | null): GithubRepo | null =>
    repoName ? (repoByName.get(repoName.toLowerCase()) ?? null) : null

  return (
    <Section
      id={SECTION_IDS.projects}
      index={5}
      eyebrow={t.projects.eyebrow}
      title={t.projects.title}
      highlight={t.projects.titleHighlight}
      description={t.projects.description}
    >
      {primary ? <PrimaryProject project={primary} repo={findRepo(primary.repoName)} /> : null}

      {others.length > 0 ? (
        <ul className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {others.map((project, index) => (
            <li key={project.id}>
              <Reveal delay={index * 0.08} className="h-full">
                <ProjectCard project={project} repo={findRepo(project.repoName)} />
              </Reveal>
            </li>
          ))}
        </ul>
      ) : null}

      <Reveal className="mt-16 sm:mt-20">
        <RepoExplorer
          repos={repos}
          languages={languages}
          featured={all}
          profileUrl={profile.githubUrl}
          isLoading={isLoading}
        />
      </Reveal>
    </Section>
  )
}
