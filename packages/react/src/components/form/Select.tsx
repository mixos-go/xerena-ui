import { forwardRef } from 'react'
import { useClassName } from '../../primitives'
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { error?: boolean }
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ error, disabled, children, className, style, ...rest }, ref) {
  return <select ref={ref} disabled={disabled} aria-invalid={error}
    className={useClassName({ className }, ['xr-select', error && 'xr-select--error'])}
    style={{ color: 'var(--xr-semantic-color-text)', ...style } as React.CSSProperties}
    {...rest}>{children}</select>
})
