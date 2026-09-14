import { createContext, useCallback, useContext, useState } from 'react'
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, ReactElement, ReactNode } from 'react'
import { OverlayPrimitive, Slot } from '../../primitives'
const Ctx = createContext<{ open: boolean; toggle: () => void; onClose: () => void; anchor: HTMLElement | null; setAnchor: (el: HTMLElement | null) => void }>({ open: false, toggle: () => {}, onClose: () => {}, anchor: null, setAnchor: () => {} })
function Root({ open: controlledOpen, defaultOpen = false, onClose, children }: { open?: boolean; defaultOpen?: boolean; onClose?: () => void; children: ReactNode }) {
  const [internal, setInternal] = useState(defaultOpen)
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const open = controlledOpen ?? internal
  const toggle = useCallback(() => { const next = !internal; setInternal(next); if (!next) onClose?.() }, [internal, onClose])
  const close = useCallback(() => { setInternal(false); onClose?.() }, [onClose])
  return <Ctx.Provider value={{ open, toggle, onClose: close, anchor, setAnchor }}>{children}</Ctx.Provider>
}
function Trigger({ children }: { children: ReactNode }) {
  const { open, onClose, toggle, setAnchor } = useContext(Ctx)
  return (
    <Slot
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={(e: ReactMouseEvent<HTMLElement>) => {
        setAnchor(e.currentTarget)
        toggle()
      }}
      onKeyDown={(e: ReactKeyboardEvent) => {
        if (e.key === 'Escape' && open) onClose()
        if (e.key === 'ArrowDown' && !open) toggle()
      }}
    >
      {children as ReactElement}
    </Slot>
  )
}
function Content({ children, side = 'bottom', className }: { children: ReactNode; side?: 'top'|'bottom'|'left'|'right'; className?: string }) {
  const { open, onClose, anchor } = useContext(Ctx)
  if (!open || !anchor) return null
  const r = anchor.getBoundingClientRect()
  const POS: Record<string, CSSProperties> = {
    top: { bottom: window.innerHeight - r.top + 8, left: r.left + r.width / 2, transform: 'translateX(-50%)' },
    bottom: { top: r.bottom + 8, left: r.left + r.width / 2, transform: 'translateX(-50%)' },
    left: { right: window.innerWidth - r.left + 8, top: r.top + r.height / 2, transform: 'translateY(-50%)' },
    right: { left: r.right + 8, top: r.top + r.height / 2, transform: 'translateY(-50%)' },
  }
  return (
    <OverlayPrimitive open onClose={onClose}>
      <div className={`xr-popover xr-popover--${side} ${className ?? ''}`}
        role="dialog" aria-label="Popover"
        style={{ position: 'fixed', zIndex: 50, background: 'var(--xr-semantic-color-background)', border: '1px solid var(--xr-semantic-color-border)', borderRadius: 'var(--xr-radius-md)', padding: '8px 0', boxShadow: 'var(--xr-elevation-md)', ...POS[side] }}>
        {children}
      </div>
    </OverlayPrimitive>
  )
}
export const Popover = { Root, Trigger, Content }
