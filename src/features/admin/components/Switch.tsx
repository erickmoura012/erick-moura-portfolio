import { cn } from '@/lib/utils'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  /** Nome acessível do controle. */
  label: string
  disabled?: boolean
  id?: string
}

export function Switch({ checked, onChange, label, disabled = false, id }: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-200 disabled:opacity-50',
        checked ? 'border-accent/60 bg-primary' : 'border-border-strong bg-surface-hover',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-4 rounded-full bg-white shadow transition-transform duration-200',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  )
}
