import { createContext, useCallback, useContext, useRef, useState, useEffect } from 'react'
import { useReducedMotionSync } from '../../primitives'
import type { ReactNode } from 'react'
const Ctx = createContext<{ value: string; onChange: (v: string) => void; variant: string }>({ value: '', onChange: () => {}, variant: 'underline' })
function Root({ defaultValue = '', value, onValueChange, variant = 'underline', children }: { defaultValue?: string; value?: string; onValueChange?: (v: string) => void; variant?: 'underline' | 'pill' | 'enclosed'; children: ReactNode }) {
  const [internal, setInternal] = useState(defaultValue)
  const current = value ?? internal
  const onChange = useCallback((v: string) => { if (onValueChange) { onValueChange(v) } else { setInternal(v) } }, [onValueChange])
  return <Ctx.Provider value={{ value: current, onChange, variant }}>{children}</Ctx.Provider>
}
function List({ children, className }: { children: ReactNode; className?: string }) {
  const { variant } = useContext(Ctx)
  return <div role="tablist" className={`xr-tabs__list xr-tabs__list--${variant} ${className ?? ''}`} style={{ display: 'flex', gap: variant === 'pill' ? 4 : 0, borderBottom: variant === 'underline' ? '1px solid var(--xr-semantic-color-border)' : undefined }}>{children}</div>
}
function Trigger({ value, children, disabled, className }: { value: string; children: ReactNode; disabled?: boolean; className?: string }) {
  const { value: current, onChange } = useContext(Ctx)
  const ref = useRef<HTMLButtonElement>(null)
  const isSelected = current === value
  const reduced = useReducedMotionSync()
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null)
  useEffect(() => {
    if (isSelected && ref.current && !reduced) {
      const r = ref.current.getBoundingClientRect()
      const parent = ref.current.parentElement!.getBoundingClientRect()
      setIndicator({ left: r.left - parent.left, width: r.width })
    } else {
      setIndicator(null)
    }
  }, [isSelected, reduced])
  return (
    <>
      <button ref={ref} id={`trigger-${value}`} role="tab" aria-selected={isSelected} aria-controls={`panel-${value}`} disabled={disabled}
        className={`xr-tabs__trigger ${isSelected ? 'xr-tabs__trigger--selected' : ''} ${className ?? ''}`}
        onClick={() => onChange(value)}>{children}</button>
      {indicator && <div className="xr-tabs__indicator" style={{ position: 'absolute', bottom: 0, left: indicator.left, width: indicator.width, height: 2, background: 'var(--xr-semantic-color-primary)', transition: reduced ? undefined : 'left calc(var(--xr-motion-duration-moderate) * 1ms) cubic-bezier(var(--xr-motion-easing-standard)), width calc(var(--xr-motion-duration-moderate) * 1ms) cubic-bezier(var(--xr-motion-easing-standard))' }} />}
    </>
  )
}
function Panel({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const { value: current } = useContext(Ctx)
  if (current !== value) return null
  return <div role="tabpanel" id={`panel-${value}`} aria-labelledby={`trigger-${value}`} className={className}>{children}</div>
}
export const Tabs = { Root, List, Trigger, Panel }