import type { CSSProperties } from 'react'
import { colors } from '@xerena/tokens'
import { XerenaMark } from './mark'
import type { XerenaMarkSize, XerenaMarkTone } from './mark'
import { XerenaWordmark } from './wordmark'

export type XerenaLockupVariant = 'horizontal' | 'stacked'

export interface XerenaLockupProps {
  variant?: XerenaLockupVariant
  markSize?: XerenaMarkSize
  tone?: XerenaMarkTone
  className?: string
  style?: CSSProperties
}

export function XerenaLockup({
  variant = 'horizontal',
  markSize = 'md',
  tone = 'default',
  className,
  style,
}: XerenaLockupProps) {
  const horizontal = variant === 'horizontal'
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: horizontal ? 'row' : 'column',
        alignItems: 'center',
        gap: horizontal ? 10 : 6,
        color: tone === 'onDark' ? colors.sand[50] : colors.sand[900],
        ...style,
      }}
    >
      <XerenaMark size={markSize} tone={tone} />
      <XerenaWordmark />
    </span>
  )
}