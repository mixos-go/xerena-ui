import { useClassName } from '../../primitives'
import type { CSSProperties, ReactNode } from 'react'

export interface MessageProps {
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger'
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  title?: string
  description?: string
  icon?: ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
  children?: ReactNode
}

const ICONS: Record<string, ReactNode> = { success: '✓', info: 'ℹ', warning: '⚠', danger: '✕', neutral: '' }

const POS_MAP: Record<string, CSSProperties> = {
  'top-left': { top: 16, left: 16 },
  'top-center': { top: 16, left: '50%', transform: 'translateX(-50%)' },
  'top-right': { top: 16, right: 16 },
  'bottom-left': { bottom: 16, left: 16 },
  'bottom-center': { bottom: 16, left: '50%', transform: 'translateX(-50%)' },
  'bottom-right': { bottom: 16, right: 16 },
}

export function Message({ tone = 'neutral', position = 'bottom-center', title, description, icon, dismissible, onDismiss, className, children }: MessageProps) {
  return (
    <div role="alert" className={useClassName({ className }, ['xr-message', `xr-message--${tone}`])}
      style={{ position: 'fixed', zIndex: 40, ...POS_MAP[position], display: 'flex', alignItems: 'flex-start', gap: 'var(--xr-spacing-2)', background: 'var(--xr-semantic-color-background)', border: '1px solid var(--xr-semantic-color-border)', borderRadius: 'var(--xr-radius-md)', padding: '12px 16px', boxShadow: 'var(--xr-elevation-md)' }}>
      <span className="xr-message__icon">{icon ?? ICONS[tone]}</span>
      <div className="xr-message__body">
        {title && <div className="xr-message__title" style={{ fontWeight: 600, color: 'var(--xr-semantic-color-text)' }}>{title}</div>}
        {description && <div className="xr-message__desc" style={{ fontSize: 14, color: 'var(--xr-semantic-color-textMuted)' }}>{description}</div>}
        {children}
      </div>
      {dismissible && <button aria-label="Dismiss" onClick={onDismiss} className="xr-message__close" style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>}
    </div>
  )
}
