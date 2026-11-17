import { lazy, Suspense, useEffect, type ComponentType, type LazyExoticComponent } from 'react'
import { usePageMeta } from '@/hooks/use-page-meta'
import { useMessages } from '@/i18n'
import { Hero } from './Hero'
import { SectionIndex } from './SectionIndex'

type SectionModule = () => Promise<{ default: ComponentType }>

/**
 * Seções abaixo da dobra ficam fora do bundle inicial. No HTML pré-renderizado o
 * conteúdo já está presente; o React hidrata cada seção quando o código dela chega
 * (hidratação seletiva), sem esconder nada do visitante.
 */
const sectionLoaders: SectionModule[] = [
  () => import('@/features/about/AboutSection').then((m) => ({ default: m.AboutSection })),
  () =>
    import('@/features/experience/ExperienceSection').then((m) => ({
      default: m.ExperienceSection,
    })),
  () => import('@/features/skills/SkillsSection').then((m) => ({ default: m.SkillsSection })),
  () =>
    import('@/features/solutions/SolutionsSection').then((m) => ({ default: m.SolutionsSection })),
  () => import('@/features/projects/ProjectsSection').then((m) => ({ default: m.ProjectsSection })),
  () => import('@/features/github/GithubSection').then((m) => ({ default: m.GithubSection })),
  () =>
    import('@/features/education/EducationSection').then((m) => ({ default: m.EducationSection })),
  () => import('@/features/contact/ContactSection').then((m) => ({ default: m.ContactSection })),
]

const sections: LazyExoticComponent<ComponentType>[] = sectionLoaders.map((load) => lazy(load))

export function HomePage() {
  const t = useMessages()
  usePageMeta(t.meta.title, t.meta.description)

  // Após a primeira pintura, baixa as seções restantes para navegações futuras.
  useEffect(() => {
    const preload = () => sectionLoaders.forEach((load) => void load())
    if ('requestIdleCallback' in window) {
      const handle = window.requestIdleCallback(preload, { timeout: 3000 })
      return () => window.cancelIdleCallback(handle)
    }
    const timer = setTimeout(preload, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Hero />
      <SectionIndex />
      {sections.map((Section, index) => (
        <Suspense key={index} fallback={<div className="min-h-[60vh]" aria-hidden="true" />}>
          <Section />
        </Suspense>
      ))}
    </>
  )
}
