import { createContext, useContext } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { OverlayPrimitive } from '../../primitives'
const Ctx = createContext<{ open: boolean; side: string; size: string; onClose: () => void }>({ open: false, side: 'right', size: 'md', onClose: () => {} })
function Root({ open, onClose = () => {}, side = 'right', size = 'md', children }: { open?: boolean; onClose?: () => void; side?: 'left'|'right'|'top'|'bottom'; size?: 'xs'|'sm'|'md'|'lg'; children: ReactNode }) {
  return <Ctx.Provider value={{ open: open ?? false, side, size, onClose }}>{children}</Ctx.Provider>
}
function Trigger({ children }: { children: ReactNode }) {
  const { onClose } = useContext(Ctx)
  return <span onClick={onClose}>{children}</span>
}
function Content({ children, side: sideProp, className }: { children: ReactNode; side?: 'left'|'right'|'top'|'bottom'; className?: string }) {
  const { open, side, size, onClose } = useContext(Ctx)
  const s = side ?? sideProp
  const SIZES: Record<string, string> = { xs: '240px', sm: '320px', md: '400px', lg: '560px' }
  const style: CSSProperties = { position: 'fixed', background: 'var(--xr-semantic-color-background)', zIndex: 41, transition: 'transform calc(var(--xr-motion-duration-moderate) * 1ms) cubic-bezier(var(--xr-motion-easing-enter))', ...(s === 'right' ? { top: 0, bottom: 0, right: 0, width: SIZES[size] } : s === 'left' ? { top: 0, bottom: 0, left: 0, width: SIZES[size] } : s === 'top' ? { top: 0, left: 0, right: 0 } : { bottom: 0, left: 0, right: 0 }) }
  return <OverlayPrimitive open={open} onClose={onClose} focusTrap><div className={`xr-drawer xr-drawer--${s} ${className ?? ''}`} style={style}>{children}</div></OverlayPrimitive>
}
export const Drawer = { Root, Trigger, Content }