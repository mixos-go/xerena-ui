import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { OverlayPrimitive, Slot, useReducedMotionSync, useRovingFocus } from '../../primitives'
import type { KeyboardEvent, ReactElement, ReactNode } from 'react'
import type { CSSProperties } from 'react'
const Ctx = createContext<{ open: boolean; setOpen: (o: boolean) => void; openMenu: () => void; lastFocused: React.RefObject<HTMLElement | null>; triggerRef: React.RefObject<HTMLElement | null> }>({ open: false, setOpen: () => {}, openMenu: () => {}, lastFocused: { current: null }, triggerRef: { current: null } })
function Root({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const lastFocused = useRef<HTMLElement | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const openMenu = useCallback(() => {
    lastFocused.current = document.activeElement as HTMLElement | null
    setOpen(true)
  }, [])
  return <Ctx.Provider value={{ open, setOpen, openMenu, lastFocused, triggerRef }}>{children}</Ctx.Provider>
}
function Trigger({ children }: { children: ReactNode }) {
  const { open, setOpen, openMenu, triggerRef } = useContext(Ctx)
  return (
    <Slot ref={triggerRef} aria-haspopup="menu" aria-expanded={open} onClick={() => (open ? setOpen(false) : openMenu())}>
      {children as ReactElement}
    </Slot>
  )
}
function Content({ children, className }: { children: ReactNode; className?: string }) {
  const { open, setOpen, lastFocused, triggerRef } = useContext(Ctx)
  const reduced = useReducedMotionSync()
  const contentRef = useRef<HTMLDivElement>(null)
  const { handleKeydown } = useRovingFocus()
  useEffect(() => {
    if (open) {
      const first = contentRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')
      first?.focus()
    }
  }, [open])
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const items = Array.from(contentRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ?? [])
    handleKeydown(e, items)
    const target = e.target as HTMLElement
    if (e.key === 'Enter' || e.key === ' ') {
      if (target.getAttribute('role') === 'menuitem') {
        e.preventDefault()
        target.click()
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      lastFocused.current?.focus()
    }
  }
  if (!open) return null
  const style: CSSProperties = { background: 'var(--xr-semantic-color-background)', border: '1px solid var(--xr-semantic-color-border)', borderRadius: 'var(--xr-radius-md)', padding: '4px 0', boxShadow: 'var(--xr-elevation-md)', minWidth: 160, animation: reduced ? undefined : `xr-menu-in calc(var(--xr-motion-duration-fast) * 1ms) cubic-bezier(var(--xr-motion-easing-enter))` }
  return <OverlayPrimitive open onClose={() => setOpen(false)}
    onOutside={(e) => {
      if (triggerRef.current && e.target instanceof Node && triggerRef.current.contains(e.target)) return
      setOpen(false)
    }}>
    <div ref={contentRef} role="menu" className={`xr-menu xr-menu--open ${className ?? ''}`} style={style} onKeyDown={onKeyDown}>
      {children}
    </div>
  </OverlayPrimitive>
}
function Item({ children, onClick, disabled, className }: { children: ReactNode; onClick?: () => void; disabled?: boolean; className?: string }) {
  return <div role="menuitem" tabIndex={-1} aria-disabled={disabled ? true : undefined} className={`xr-menu__item ${className ?? ''}`} onClick={disabled ? undefined : onClick}
    style={{ padding: '8px 16px', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1, fontSize: 14 }}>{children}</div>
}
function Separator() { return <div role="separator" className="xr-popover__separator" /> }
function Label({ children }: { children: ReactNode }) { return <div className="xr-menu__label" style={{ padding: '4px 16px', fontSize: 12, fontWeight: 600, color: 'var(--xr-semantic-color-textMuted)' }}>{children}</div> }
export const Menu = { Root, Trigger, Content, Item, Separator, Label }
