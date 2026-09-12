import { useId } from 'react'
import type { CSSProperties } from 'react'
import { colors } from '@xerena/tokens'

export type XerenaMarkSize = 'sm' | 'md' | 'lg'
export type XerenaMarkTone = 'default' | 'onDark'

export interface XerenaMarkProps {
  size?: XerenaMarkSize
  tone?: XerenaMarkTone
  title?: string
  className?: string
  style?: CSSProperties
}

const SIZE: Record<XerenaMarkSize, number> = { sm: 24, md: 32, lg: 48 }
const HEX = 'M24 2 L43.1 13 L43.1 35 L24 46 L4.9 35 L4.9 13 Z'

export function XerenaMark({
  size = 'md',
  tone = 'default',
  title = 'Xerena',
  className,
  style,
}: XerenaMarkProps) {
  const uid = useId()
  const faceId = `${uid}-face`
  const strokeId = `${uid}-stroke`
  const dark = tone === 'onDark'
  const dimension = SIZE[size]

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id={faceId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={dark ? colors.sand[700] : colors.sand[100]} />
          <stop offset="100%" stopColor={dark ? colors.sand[900] : colors.sand[50]} />
        </linearGradient>
        <linearGradient id={strokeId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors.ember[500]} />
          <stop offset="100%" stopColor={colors.ember[600]} />
        </linearGradient>
        <filter id={`${uid}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="rgba(43,38,32,0.10)" />
        </filter>
      </defs>
      <g filter={`url(#${uid}-shadow)`}>
        <path d={HEX} fill={`url(#${faceId})`} />
        <path
          d={HEX}
          fill="none"
          stroke={colors.ember[100]}
          strokeOpacity={dark ? 0.3 : 0.5}
          strokeWidth="1.5"
        />
      </g>
      <line
        x1="16.5"
        y1="31.5"
        x2="31.5"
        y2="16.5"
        stroke={`url(#${strokeId})`}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <line
        x1="16.5"
        y1="16.5"
        x2="31.5"
        y2="31.5"
        stroke={`url(#${strokeId})`}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <line x1="18.7" y1="29.3" x2="29.3" y2="18.7" stroke={colors.ember[100]} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.5" />
      <line x1="18.7" y1="18.7" x2="29.3" y2="29.3" stroke={colors.ember[100]} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.5" />
    </svg>
  )
}