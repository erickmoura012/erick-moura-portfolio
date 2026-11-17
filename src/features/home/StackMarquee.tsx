import { useMemo } from 'react'
import { TechIcon } from '@/components/common/TechIcon'
import { usePortfolioContent } from '@/hooks/use-portfolio-content'

/**
 * Faixa contínua com as tecnologias usadas no trabalho e nos projetos.
 * É decorativa (a lista completa e acessível está na seção de skills), pausa no
 * hover e fica parada para quem prefere movimento reduzido.
 */
export function StackMarquee() {
  const { skills } = usePortfolioContent()
  const items = useMemo(() => skills.filter((skill) => skill.level !== 'learning'), [skills])

  if (items.length === 0) return null
  const sequence = [...items, ...items]

  return (
    <div
      aria-hidden="true"
      className="group overflow-hidden border-y border-border bg-background-alt/60 py-4"
    >
      <ul className="flex w-max animate-marquee items-center group-hover:[animation-play-state:paused]">
        {sequence.map((skill, index) => (
          <li
            key={`${skill.id}-${index}`}
            className="flex items-center gap-3 pr-10 font-display text-lg font-medium whitespace-nowrap text-foreground/70"
          >
            <TechIcon name={skill.icon} className="size-[1.125rem] text-subtle" />
            {skill.name}
            <span className="pl-7 text-electric">/</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
