import { Slot } from '../../primitives/Slot'
import { useClassName } from '../../primitives/useClassName'
import type { CSSProperties } from 'react'

export interface TextProps {
  variant?: 'body' | 'muted' | 'strong' | 'error'
  size?: 'sm' | 'md' | 'lg'
  font?: 'body' | 'mono'
  truncate?: boolean
  center?: boolean
  asChild?: boolean
  style?: CSSProperties
  className?: string
  children: React.ReactNode
}

export function Text({ variant = 'body', size = 'md', font = 'body', truncate, center, asChild, className, children, ...rest }: TextProps) {
  const cls = useClassName(
    { className },
    ['xr-text', `xr-text--${variant}`, `xr-text--${size}`, `xr-text--${font}`, truncate && 'xr-text--truncate', center && 'xr-text--center'],
  )
  const Comp = asChild ? Slot : 'span'
  return (
    <Comp className={cls} {...rest}>
      {children}
    </Comp>
  )
}
