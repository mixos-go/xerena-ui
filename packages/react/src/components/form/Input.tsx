import { forwardRef } from 'react'
import { useClassName, useDisabled } from '../../primitives'
import type { CSSProperties } from 'react'
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> { variant?: 'outlined' | 'filled'; error?: boolean }
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ variant = 'outlined', error, disabled, readOnly, className, style, ...rest }, ref) {
  const { disabled: isDisabled } = useDisabled(disabled)
  return (
    <input
      ref={ref}
      disabled={isDisabled}
      readOnly={readOnly}
      aria-invalid={error}
      className={useClassName({ className }, [`xr-input xr-input--${variant}`, error && 'xr-input--error'])}
      style={{ backgroundColor: variant === 'filled' ? 'var(--xr-semantic-color-surface)' : 'transparent', color: 'var(--xr-semantic-color-text)', borderColor: error ? 'var(--xr-semantic-color-danger)' : 'var(--xr-semantic-color-border)', ...style } as CSSProperties}
      {...rest}
    />
  )
})