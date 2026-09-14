import { createContext, useCallback, useContext, useState } from 'react'
import { useReducedMotionSync } from '../../primitives'
import type { ReactNode } from 'react'
const Ctx = createContext<{ type: string; expanded: Set<string>; toggle: (v: string) => void }>({ type: 'single', expanded: new Set(), toggle: () => {} })
function Root({ type = 'single', defaultValue = [], children }: { type?: 'single' | 'multiple'; defaultValue?: string[]; children: ReactNode }) {
  const [expanded, setExpanded] = useState(new Set(defaultValue))
  const toggle = useCallback((v: string) => setExpanded(prev => {
    const n = new Set(prev)
    if (n.has(v)) { n.delete(v); return n }
    if (type === 'single') return new Set([v])
    n.add(v)
    return n
  }), [type])
  return <Ctx.Provider value={{ type, expanded, toggle }}>{children}</Ctx.Provider>
}
function Item({ value, children }: { value: string; children: ReactNode }) {
  const { expanded } = useContext(Ctx)
  return <div className="xr-accordion__item" data-state={expanded.has(value) ? 'open' : 'closed'}>{children}</div>
}
function Header({ children }: { children: ReactNode }) { return <h3 className="xr-accordion__header">{children}</h3> }
function Trigger({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const { expanded, toggle } = useContext(Ctx)
  const isOpen = expanded.has(value)
  const reduced = useReducedMotionSync()
  return (
    <button type="button" aria-expanded={isOpen} aria-controls={`acc-panel-${value}`} className={`xr-accordion__trigger ${className ?? ''}`}
      onClick={() => toggle(value)}
      style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '12px 0', fontWeight: 600, color: 'var(--xr-semantic-color-text)' }}>
      {children}
      <span style={{ transition: reduced ? undefined : 'transform calc(var(--xr-motion-duration-fast) * 1ms) cubic-bezier(var(--xr-motion-easing-standard))', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
    </button>
  )
}
function Content({ value, children }: { value: string; children: ReactNode }) {
  const { expanded } = useContext(Ctx)
  const reduced = useReducedMotionSync()
  const isOpen = expanded.has(value)
  if (!isOpen) return null
  return <div role="region" id={`acc-panel-${value}`} className="xr-accordion__content"
    style={{ overflow: 'hidden', transition: reduced ? undefined : 'max-height calc(var(--xr-motion-duration-moderate) * 1ms) cubic-bezier(var(--xr-motion-easing-standard))' }}>
    {children}
  </div>
}
export const Accordion = { Root, Item, Header, Trigger, Content }