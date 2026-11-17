import { useMessages } from '@/i18n'

/**
 * Retrato em moldura editorial: bloco de cor deslocado atrás da foto, marcas de
 * corte nos cantos e legenda técnica. É o elemento de maior área acima da dobra,
 * por isso carrega com prioridade e tem dimensões explícitas (sem layout shift).
 */
export function HeroPortrait() {
  const t = useMessages()
  const sizes = '(min-width: 1024px) 30vw, (min-width: 640px) 24rem, 82vw'

  return (
    <figure className="mx-auto w-full max-w-[22rem] animate-rise sm:max-w-sm lg:max-w-none lg:pl-6">
      <div className="crop-marks relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 translate-x-3 translate-y-3 rounded-[3px] bg-electric sm:translate-x-4 sm:translate-y-4"
        />
        <picture>
          <source
            type="image/avif"
            srcSet="/images/erick-moura-480.avif 480w, /images/erick-moura-960.avif 960w"
            sizes={sizes}
          />
          <img
            src="/images/erick-moura-960.webp"
            srcSet="/images/erick-moura-480.webp 480w, /images/erick-moura-960.webp 960w"
            sizes={sizes}
            alt={t.hero.photoAlt}
            width={960}
            height={1200}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="relative aspect-[4/5] w-full rounded-[3px] border border-border-strong object-cover"
          />
        </picture>
        <span className="absolute top-3 left-3 rounded-[3px] border border-border-strong bg-background/85 px-2 py-1 label-mono text-foreground backdrop-blur-sm">
          {t.hero.photoTag}
        </span>
      </div>
      <figcaption className="mt-7 flex items-center justify-between gap-4 label-mono text-subtle">
        <span>{t.hero.photoCaption}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
        <span>{t.hero.photoCaptionRight}</span>
      </figcaption>
    </figure>
  )
}
