import { cn } from '@/lib/utils'
import { BRAND_ICONS, FALLBACK_TECH_ICON, GENERIC_ICONS } from './tech-icons'

interface TechIconProps {
  name: string
  className?: string
}

export function TechIcon({ name, className }: TechIconProps) {
  const brand = BRAND_ICONS[name]
  if (brand) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        className={cn('size-5', className)}
      >
        <path d={brand.path} />
      </svg>
    )
  }

  const Generic = GENERIC_ICONS[name] ?? FALLBACK_TECH_ICON
  return <Generic aria-hidden="true" className={cn('size-5', className)} />
}
