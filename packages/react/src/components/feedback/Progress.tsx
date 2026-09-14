import { useReducedMotionSync, useClassName } from '../../primitives'
import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

export interface ProgressProps {
  value?: number
  variant?: 'bar' | 'pageTop' | 'pageBottom' | 'mouse' | 'circle'
  size?: number
  stroke?: number
  className?: string
  label?: string
}

export function Progress({ value = 0, variant = 'bar', size = 80, stroke = 8, className, label }: ProgressProps) {
  const reduced = useReducedMotionSync()
  const ringRef = useRef<HTMLDivElement>(null)
  const clamp = Math.max(0, Math.min(100, value))

  useEffect(() => {
    if (variant !== 'mouse' || reduced) return
    const handler = (e: MouseEvent) => {
      if (!ringRef.current) return
      ringRef.current.style.left = `${e.clientX}px`
      ringRef.current.style.top = `${e.clientY}px`
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [variant, reduced])

  if (variant === 'circle') {
    const r = (size - stroke) / 2
    const circ = 2 * Math.PI * r
    const offset = circ - (clamp / 100) * circ
    return (
      <div
        role="progressbar"
        aria-valuenow={clamp}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={useClassName({ className }, ['xr-progress', 'xr-progress--circle'])}
      >
        <svg width={size} height={size} className="xr-progress__svg">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--xr-semantic-color-border)" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--xr-semantic-color-primary)"
            strokeWidth={stroke}
            strokeDasharray={circ}
            strokeDashoffset={reduced ? offset : undefined}
            className="xr-progress__circle"
            style={reduced ? undefined : { transition: 'stroke-dashoffset calc(var(--xr-motion-duration-base) * 1ms) cubic-bezier(var(--xr-motion-easing-standard))' } as CSSProperties}
          />
        </svg>
      </div>
    )
  }

  if (variant === 'mouse') {
    return (
      <div
        role="progressbar"
        aria-hidden="true"
        aria-valuenow={clamp}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={useClassName({ className }, ['xr-progress', 'xr-progress--mouse'])}
        style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9999 }}
      >
        <div
          ref={ringRef}
          className="xr-progress__ring"
          style={{
            position: 'absolute',
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '3px solid var(--xr-semantic-color-primary)',
            borderTopColor: 'transparent',
            transform: 'translate(-50%,-50%)',
            transition: reduced ? undefined : 'border-color calc(var(--xr-motion-duration-base) * 1ms) cubic-bezier(var(--xr-motion-easing-standard))',
          }}
        >
          <span className="sr-only">{clamp}%</span>
        </div>
      </div>
    )
  }

  const isFixed = variant === 'pageTop' || variant === 'pageBottom'
  const fixedStyle: CSSProperties = isFixed
    ? { position: 'fixed', left: 0, right: 0, height: 3, zIndex: 40, ...(variant === 'pageTop' ? { top: 0 } : { bottom: 0 }) }
    : { width: '100%', height: 8, borderRadius: 'var(--xr-radius-full)' }
  return (
    <div
      role="progressbar"
      aria-valuenow={clamp}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={useClassName({ className }, [`xr-progress xr-progress--${variant}`])}
      style={{ ...fixedStyle, background: 'var(--xr-semantic-color-border)', overflow: 'hidden' }}
    >
      <div
        className="xr-progress__fill"
        style={{
          height: '100%',
          width: `${clamp}%`,
          background: 'var(--xr-semantic-color-primary)',
          transition: reduced ? undefined : 'width calc(var(--xr-motion-duration-base) * 1ms) cubic-bezier(var(--xr-motion-easing-standard))',
        }}
      />
    </div>
  )
}