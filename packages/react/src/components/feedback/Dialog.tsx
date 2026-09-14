import { createContext, useContext, useEffect, useState, useId } from 'react'
import type { ReactNode } from 'react'
import { OverlayPrimitive } from '../../primitives'
const Ctx = createContext<{ open: boolean; onClose: () => void; labelledBy?: string; setLabelledBy: (id?: string) => void }>({ open: false, onClose: () => {}, setLabelledBy: () => {} })

function Root({ open, onClose = () => {}, children }: { open?: boolean; onClose?: () => void; children: ReactNode }) {
  const [internal, setInternal] = useState(false)
  const [labelledBy, setLabelledBy] = useState<string | undefined>(undefined)
  const isOpen = open ?? internal
  return <Ctx.Provider value={{ open: isOpen, onClose: () => { setInternal(false); onClose() }, labelledBy, setLabelledBy }}>{children}</Ctx.Provider>
}
function Portal({ children }: { children: ReactNode }) {
  const { open, onClose, labelledBy } = useContext(Ctx)
  return <OverlayPrimitive open={open} onClose={onClose} focusTrap labeledBy={labelledBy}>{children}</OverlayPrimitive>
}
function Title({ id, children }: { id?: string; children: ReactNode }) {
  const { setLabelledBy } = useContext(Ctx)
  const generated = useId()
  const titleId = id ?? generated
  useEffect(() => { setLabelledBy(titleId); return () => setLabelledBy(undefined) }, [titleId, setLabelledBy])
  return <h2 id={titleId} className="xr-dialog__title">{children}</h2>
}
function Description({ id, children }: { id?: string; children: ReactNode }) { return <p id={id} className="xr-dialog__desc">{children}</p> }
function Content({ children, className }: { children: ReactNode; className?: string }) {
  const { labelledBy } = useContext(Ctx)
  return <div role="dialog" aria-modal="true" aria-labelledby={labelledBy} className={`xr-dialog__content ${className ?? ''}`}
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