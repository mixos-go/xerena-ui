import { useClassName } from '../../primitives/useClassName'
import type { ReactNode } from 'react'
export interface FieldProps { label?: string; hint?: string; error?: string; required?: boolean; asChild?: boolean; htmlFor?: string; children: ReactNode; disabled?: boolean; className?: string }
export function Field({ label, hint, error, required, htmlFor, children, className }: FieldProps) {
  const id = htmlFor ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  return (
    <div className={useClassName({ className }, ['xr-field', error && 'xr-field--error'])}>
      {label && <label htmlFor={id} className="xr-field__label">{label}{required && <span className="xr-field__required"> *</span>}</label>}
      <div className="xr-field__control">{children}</div>
      {hint && !error && <span className="xr-field__hint">{hint}</span>}
      {error && <span className="xr-field__error" role="alert">{error}</span>}
    </div>
  )
}
