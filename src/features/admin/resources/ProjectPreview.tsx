import { ProjectCard } from '@/features/projects/FeaturedProjects'
import type { Project, ProjectScreenshot, SolutionCategory } from '@/types/content'
import type { PreviewProps } from './types'

const text = (value: unknown): string => (typeof value === 'string' ? value : '')
const optionalText = (value: unknown): string | null =>
  typeof value === 'string' && value !== '' ? value : null
const list = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

/** Mostra o projeto com o mesmo cartão usado no site público. */
export function ProjectPreview({ values }: PreviewProps) {
  const project: Project = {
    id: 'preview',
    slug: text(values.slug) || 'preview',
    repoName: optionalText(values.repoName),
    title: text(values.title) || 'Título do projeto',
    tagline: text(values.tagline),
    description: text(values.description),
    challenge: optionalText(values.challenge),
    solution: optionalText(values.solution),
    features: list(values.features),
    architecture: list(values.architecture),
    highlights: list(values.highlights),
    stack: list(values.stack),
    screenshots: Array.isArray(values.screenshots)
      ? (values.screenshots as ProjectScreenshot[])
      : [],
    repoUrl: optionalText(values.repoUrl),
    demoUrl: optionalText(values.demoUrl),
    category: (text(values.category) || 'web') as SolutionCategory,
    featured: values.featured === true,
    isPrimary: values.isPrimary === true,
    sortOrder: 0,
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="mb-3 font-mono text-xs text-subtle">
        Cartão como aparece em “Projetos em destaque”
      </p>
      {/* `inert`: os links do cartão não devem navegar de dentro do formulário. */}
      <div inert>
        <ProjectCard project={project} repo={null} />
      </div>
    </div>
  )
}
