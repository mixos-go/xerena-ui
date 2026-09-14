import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import type { CSSProperties } from 'react'

export interface ToastOptions {
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral'
  title?: string
  description?: string
  action?: { label: string; onClick: () => void }
  dismissible?: boolean
  onDismiss?: () => void
  autoHideDuration?: number
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  className?: string
}

export function Toast({ variant = 'neutral', title, description, action, dismissible, onDismiss, autoHideDuration = 5000, className }: ToastOptions) {
  useEffect(() => { if (autoHideDuration) { const t = setTimeout(() => onDismiss?.(), autoHideDuration); return () => clearTimeout(t) } }, [autoHideDuration, onDismiss])
  return (
    <div role={variant === 'danger' ? 'alert' : 'status'} className={`xr-toast xr-toast--${variant} ${className ?? ''}`}
      style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 50, background: 'var(--xr-semantic-color-background)', border: '1px solid var(--xr-semantic-color-border)', borderRadius: 'var(--xr-radius-md)', padding: '12px 16px', boxShadow: 'var(--xr-elevation-md)', display: 'flex', alignItems: 'flex-start', gap: 'var(--xr-spacing-2)', maxWidth: 360, animation: 'xr-toast-in calc(var(--xr-motion-duration-moderate) * 1ms) cubic-bezier(var(--xr-motion-easing-enter))' } as CSSProperties}>
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: 600 }}>{title}</div>}
        {description && <div style={{ fontSize: 14, color: 'var(--xr-semantic-color-textMuted)', marginTop: 4 }}>{description}</div>}
        {action && <button onClick={action.onClick} className="xr-toast__action" style={{ background: 'none', border: 'none', color: 'var(--xr-semantic-color-primary)', fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>{action.label}</button>}
      </div>
      {dismissible && <button aria-label="Dismiss" onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>}
    </div>
  )
}

let root: ReturnType<typeof createRoot> | null = null
const TOAST_STACK: Map<string, ToastOptions & { id: string }> = new Map()
let idCounter = 0
function flush() {
  if (!root) {
    const div = document.createElement('div')
    div.id = 'xerena-toast-stack'
    document.body.appendChild(div)
    root = createRoot(div)
  }
  root?.render(
    <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 50, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[...TOAST_STACK.values()].map(t => <Toast key={t.id} {...t} onDismiss={() => { TOAST_STACK.delete(t.id); flush() }} />)}
    </div>,
  )
}
export function toast(options: ToastOptions) {
  const id = `t${++idCounter}`
  TOAST_STACK.set(id, { ...options, id })
  flush()
}