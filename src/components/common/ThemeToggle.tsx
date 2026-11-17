import { Moon, Sun } from 'lucide-react'
import { toggleTheme, useTheme } from '@/hooks/use-theme'
import { useMessages } from '@/i18n'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const t = useMessages()
  const theme = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t.nav.toggleTheme}
      aria-pressed={theme === 'light'}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-hover hover:text-foreground',
        className,
      )}
    >
      <Sun aria-hidden="true" className="theme-icon-light size-[1.125rem]" />
      <Moon aria-hidden="true" className="theme-icon-dark size-[1.125rem]" />
    </button>
  )
}
