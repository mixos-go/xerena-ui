import { forwardRef } from 'react'
import { useClassName } from '../../primitives'
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { resize?: 'none' | 'auto'; error?: boolean }
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ error, resize = 'none', disabled, className, style, ...rest }, ref) {
  return <textarea ref={ref} disabled={disabled} aria-invalid={error}
    className={useClassName({ className }, ['xr-textarea', error && 'xr-textarea--error'])}
    style={{ resize, color: 'var(--xr-semantic-color-text)', ...style } as React.CSSProperties}
    {...rest} />
})
