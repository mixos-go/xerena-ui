import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { OverlayPrimitive } from '../../primitives'
const Ctx = createContext<{ open: boolean; onClose: () => void; labelledBy?: string }>({ open: false, onClose: () => {} })

function Root({ open, onClose = () => {}, children }: { open?: boolean; onClose?: () => void; children: ReactNode }) {
  const [internal, setInternal] = useState(false)
  const isOpen = open ?? internal
  return <Ctx.Provider value={{ open: isOpen, onClose: () => { setInternal(false); onClose() } }}>{children}</Ctx.Provider>
}
function Portal({ children }: { children: ReactNode }) {
  const { open, onClose, labelledBy } = useContext(Ctx)
  return <OverlayPrimitive open={open} onClose={onClose} focusTrap labeledBy={labelledBy}>{children}</OverlayPrimitive>
}
function Title({ id, children }: { id?: string; children: ReactNode }) {
  return <h2 id={id} className="xr-dialog__title">{children}</h2>
}
function Description({ id, children }: { id?: string; children: ReactNode }) { return <p id={id} className="xr-dialog__desc">{children}</p> }
function Content({ children, className }: { children: ReactNode; className?: string }) {
  return <div role="dialog" aria-modal="true" className={`xr-dialog__content ${className ?? ''}`}
    style={{ background: 'var(--xr-semantic-color-background)', borderRadius: 'var(--xr-radius-lg)', padding: 24, maxWidth: 480, width: '100%', boxShadow: 'var(--xr-elevation-lg)', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 41 }}>
    {children}
  </div>
}
function Close({ children = '✕', className }: { children?: ReactNode; className?: string }) {
  const { onClose } = useContext(Ctx)
  return <button onClick={onClose} aria-label="Close" className={className} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer' }}>{children}</button>
}
function Overlay() { return null }
export const Dialog = { Root, Portal, Overlay, Content, Close, Title, Description }