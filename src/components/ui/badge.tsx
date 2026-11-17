import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-[4px] border px-2 py-1 text-xs leading-none font-medium whitespace-nowrap',
  {
    variants: {
      variant: {
        neutral: 'border-border-strong text-muted',
        accent: 'border-accent/40 bg-accent/10 text-accent',
        cyan: 'border-cyan/40 bg-cyan/10 text-cyan',
        violet: 'border-violet/40 bg-violet/10 text-violet',
        success: 'border-success/40 bg-success/10 text-success',
        warning: 'border-warning/40 bg-warning/10 text-warning',
        danger: 'border-danger/40 bg-danger/10 text-danger',
      },
      mono: { true: 'font-mono tracking-tight', false: '' },
    },
    defaultVariants: { variant: 'neutral', mono: false },
  },
)

export type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants>

export function Badge({ className, variant, mono, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, mono }), className)} {...props} />
}
