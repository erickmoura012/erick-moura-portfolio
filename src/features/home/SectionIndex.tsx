import { ArrowDownRight } from 'lucide-react'
import { Link } from 'react-router'
import { INDEX_SECTIONS, SECTION_IDS, sectionNumber } from '@/app/sections'
import { useMessages } from '@/i18n'

/**
 * Índice de atalhos logo abaixo da abertura: cada bloco leva direto a uma seção,
 * com a mesma numeração usada nos cabeçalhos.
 */
export function SectionIndex() {
  const t = useMessages()

  return (
    <nav aria-labelledby="indice-titulo" className="border-b border-border">
      <div className="container-page py-12 frame-x sm:py-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <h2 id="indice-titulo" className="font-display text-2xl font-semibold text-foreground">
            {t.sectionIndex.title}
          </h2>
          <p className="text-sm text-muted">{t.sectionIndex.description}</p>
        </div>

        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-border bg-border lg:grid-cols-4">
          {INDEX_SECTIONS.map((key) => {
            const item = t.sectionIndex.items[key]
            return (
              <li key={key} className="bg-background">
                <Link
                  to={{ pathname: '/', hash: `#${SECTION_IDS[key]}` }}
                  className="group flex h-full min-h-32 flex-col justify-between gap-6 p-4 transition-colors duration-200 hover:bg-primary focus-visible:bg-primary sm:p-5"
                >
                  <span className="flex items-center justify-between">
                    <span className="font-mono text-xs text-subtle transition-colors group-hover:text-white/80 group-focus-visible:text-white/80">
                      {sectionNumber(key)}
                    </span>
                    <ArrowDownRight
                      aria-hidden="true"
                      className="size-4 text-subtle transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:text-white group-focus-visible:text-white"
                    />
                  </span>
                  <span>
                    <span className="block font-display text-lg font-semibold text-foreground transition-colors group-hover:text-white group-focus-visible:text-white sm:text-xl">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-xs leading-snug text-muted transition-colors group-hover:text-white/85 group-focus-visible:text-white/85 sm:text-sm">
                      {item.hint}
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
