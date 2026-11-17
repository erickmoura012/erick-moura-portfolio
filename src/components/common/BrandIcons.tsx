import type { ComponentProps } from 'react'
import { siGithub } from 'simple-icons'

type IconProps = ComponentProps<'svg'>

function BrandSvg({ children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      {children}
    </svg>
  )
}

export function GithubIcon(props: IconProps) {
  return (
    <BrandSvg {...props}>
      <path d={siGithub.path} />
    </BrandSvg>
  )
}

/** Glifo "in" desenhado para este projeto (a marca não está nas bibliotecas de ícones). */
export function LinkedinIcon(props: IconProps) {
  return (
    <BrandSvg {...props}>
      <path d="M4.75 2.5a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5ZM2.9 8.75h3.7V21.5H2.9V8.75Zm6.1 0h3.55v1.75h.05c.5-.94 1.72-2.05 3.6-2.05 3.83 0 4.55 2.5 4.55 5.8v7.25h-3.7v-6.4c0-1.53-.03-3.5-2.12-3.5-2.13 0-2.45 1.67-2.45 3.4v6.5H9V8.75Z" />
    </BrandSvg>
  )
}
