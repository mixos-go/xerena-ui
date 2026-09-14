import { useClassName, useFocusRing, usePress } from '../../primitives'
import { semantic } from '@xerena/tokens'
import type { CSSProperties, ReactNode } from 'react'
export interface CardProps { variant?: 'outlined'|'elevated'|'soft'|'interactive'|'flat'; padding?: keyof typeof semantic.spacing; className?: string; children: ReactNode }
const VARIANTS = { outlined: { border: '1px solid var(--xr-semantic-color-border)', background: 'var(--xr-semantic-color-background)', boxShadow: 'none' }, elevated: { border: 'none', background: 'var(--xr-semantic-color-background)', boxShadow: 'var(--xr-elevation-md)' }, soft: { border: 'none', background: 'var(--xr-semantic-color-surface)', boxShadow: 'none' }, interactive: { border: '1px solid var(--xr-semantic-color-border)', background: 'var(--xr-semantic-color-background)', boxShadow: 'var(--xr-elevation-xs)' }, flat: { border: 'none', background: 'transparent', boxShadow: 'none' } } as const
export function Card({ variant = 'outlined', padding = 'md', className, children }: CardProps) {
  const { focusWithin, onFocus, onBlur } = useFocusRing()
  const { pressed, onPointerDown, onPointerUp, onPointerLeave } = usePress()
  const style: CSSProperties = { ...VARIANTS[variant], padding: semantic.spacing[padding] ? `${semantic.spacing[padding]}px` : undefined, borderRadius: 'var(--xr-radius-md)', transition: 'transform calc(var(--xr-motion-duration-base) * 1ms) cubic-bezier(var(--xr-motion-easing-standard)), box-shadow calc(var(--xr-motion-duration-base) * 1ms) cubic-bezier(var(--xr-motion-easing-standard))' }
  if (variant === 'interactive') {
    style.cursor = 'pointer'
    style.transform = pressed ? 'translateY(-1px)' : undefined
    style.boxShadow = pressed ? 'var(--xr-elevation-sm)' : 'var(--xr-elevation-md)'
  }
  return <div className={useClassName({ className }, ['xr-card', `xr-card--${variant}`, variant === 'interactive' && focusWithin && 'xr-card--focus'])} style={style}
    tabIndex={variant === 'interactive' ? 0 : undefined} role={variant === 'interactive' ? 'button' : undefined}
    onFocus={onFocus} onBlur={onBlur} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerLeave={onPointerLeave}>
    {children}
  </div>
}