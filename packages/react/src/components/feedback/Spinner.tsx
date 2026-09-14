import { useClassName } from '../../primitives'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

export function Spinner({ size = 'md', className, label = 'Loading…' }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className={useClassName({ className }, ['xr-spinner-host'])}>
      <span aria-hidden="true" className={`xr-spinner xr-spinner--${size}`} />
      <span className="sr-only">{label}</span>
    </span>
  )
}