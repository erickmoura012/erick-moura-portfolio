import { CircleAlert } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

const controlClasses = [
  'border-border-strong bg-background-alt/70 text-foreground placeholder:text-subtle w-full rounded-md border px-4 text-sm',
  'transition-[border-color,box-shadow] duration-200',
  'hover:border-accent/50 focus-visible:border-accent focus-visible:outline-none',
  'focus-visible:shadow-[0_0_0_3px_rgb(59_130_246/0.25)]',
  'aria-invalid:border-danger aria-invalid:focus-visible:shadow-[0_0_0_3px_rgb(248_113_113/0.25)]',
  'disabled:cursor-not-allowed disabled:opacity-60',
]

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(controlClasses, 'h-11', className)} {...props} />
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        controlClasses,
        'min-h-32 resize-y scrollbar-thin py-3 leading-relaxed',
        className,
      )}
      {...props}
    />
  )
}

export function Select({ className, children, ...props }: ComponentProps<'select'>) {
  return (
    <select className={cn(controlClasses, 'h-11 appearance-auto pr-3', className)} {...props}>
      {children}
    </select>
  )
}

export function Label({ className, ...props }: ComponentProps<'label'>) {
  return <label className={cn('text-sm font-medium text-foreground', className)} {...props} />
}

/** Atributos de acessibilidade que ligam um controle à sua mensagem de erro. */
export function fieldA11y(id: string, error?: string) {
  return {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
  } as const
}

interface FieldProps {
  id: string
  label: string
  error?: string
  hint?: string
  className?: string
  children: ReactNode
}

export function Field({ id, label, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && !error ? <p className="text-xs text-subtle">{hint}</p> : null}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-center gap-1.5 text-xs text-danger"
        >
          <CircleAlert aria-hidden="true" className="size-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  )
}
