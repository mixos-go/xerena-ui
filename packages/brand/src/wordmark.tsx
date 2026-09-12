import type { CSSProperties } from 'react'
import { typography } from '@xerena/tokens'

export type XerenaWordmarkVariant = 'default' | 'italic'
export type XerenaWordmarkWeight = 400 | 500 | 600

export interface XerenaWordmarkProps {
  variant?: XerenaWordmarkVariant
  weight?: XerenaWordmarkWeight
  className?: string
  style?: CSSProperties
}

export function XerenaWordmark({
  variant = 'default',
  weight = 500,
  className,
  style,
}: XerenaWordmarkProps) {
  return (
    <span
      className={className}
      style={{
        fontFamily: typography.fontFamily.display,
        fontWeight: weight,
        fontStyle: variant === 'italic' ? 'italic' : 'normal',
        letterSpacing: '-0.02em',
        color: 'inherit',
        ...style,
      }}
    >
      Xerena
    </span>
  )
}