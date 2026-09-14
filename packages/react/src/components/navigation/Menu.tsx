import { createContext, useContext, useState } from 'react'
import { OverlayPrimitive, Slot, useReducedMotionSync } from '../../primitives'
import type { ReactElement, ReactNode } from 'react'
const Ctx = createContext<{ open: boolean; setOpen: (o: boolean) => void }>({ open: false, setOpen: () => {} })
function Root({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return <Ctx.Provider value={{ open, setOpen }}>{children}</Ctx.Provider>
}
function Trigger({ children }: { children: ReactNode }) {
  const { open, setOpen } = useContext(Ctx)
  return (
    <Slot aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>
      {children as ReactElement}
    </Slot>
  )
}
function Content({ children, className }: { children: ReactNode; className?: string }) {
  const { open, setOpen } = useContext(Ctx)
  const reduced = useReducedMotionSync()
  if (!open) return null
  return <OverlayPrimitive open onClose={() => setOpen(false)}>
    <div role="menu" className={`xr-menu xr-menu--open ${className ?? ''}`}
      style={{ background: 'var(--xr-semantic-color-background)', border: '1px solid var(--xr-semantic-color-border)', borderRadius: 'var(--xr-radius-md)', padding: '4px 0', boxShadow: 'var(--xr-elevation-md)', minWidth: 160, animation: reduced ? undefined : `xr-menu-in calc(var(--xr-motion-duration-fast) * 1ms) cubic-bezier(var(--xr-motion-easing-enter))` }}>
      {children}
    </div>
  </OverlayPrimitive>
}
function Item({ children, onClick, disabled, className }: { children: ReactNode; onClick?: () => void; disabled?: boolean; className?: string }) {
  return <div role="menuitem" className={`xr-menu__item ${className ?? ''}`} onClick={disabled ? undefined : onClick}
    style={{ padding: '8px 16px', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1, fontSize: 14 }}>{children}</div>
}
function Separator() { return <div role="separator" className="xr-popover__separator" /> }
function Label({ children }: { children: ReactNode }) { return <div className="xr-menu__label" style={{ padding: '4px 16px', fontSize: 12, fontWeight: 600, color: 'var(--xr-semantic-color-textMuted)' }}>{children}</div> }
export const Menu = { Root, Trigger, Content, Item, Separator, Label }