import { Children, cloneElement, createContext, useCallback, useContext, useRef, useState, useEffect, isValidElement } from 'react'
import { useReducedMotionSync, useRovingFocus } from '../../primitives'
import type { KeyboardEvent, ReactNode } from 'react'
const Ctx = createContext<{ value: string; onChange: (v: string) => void; variant: string }>({ value: '', onChange: () => {}, variant: 'underline' })
function Root({ defaultValue = '', value, onValueChange, variant = 'underline', children }: { defaultValue?: string; value?: string; onValueChange?: (v: string) => void; variant?: 'underline' | 'pill' | 'enclosed'; children: ReactNode }) {
  const [internal, setInternal] = useState(defaultValue)
  const current = value ?? internal
  const onChange = useCallback((v: string) => { if (onValueChange) { onValueChange(v) } else { setInternal(v) } }, [onValueChange])
  return <Ctx.Provider value={{ value: current, onChange, variant }}>{children}</Ctx.Provider>
}
function List({ children, className }: { children: ReactNode; className?: string }) {
  const { variant, value: current } = useContext(Ctx)
  const listRef = useRef<HTMLDivElement>(null)
  const { handleKeydown } = useRovingFocus()
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]:not(:disabled)') ?? [])
    handleKeydown(e, items)
    const focused = document.activeElement
    if (focused && items.includes(focused as HTMLElement)) {
      items.forEach(it => it.tabIndex = it === focused ? 0 : -1)
    }
    const target = e.target as HTMLElement
    if ((e.key === 'Enter' || e.key === ' ') && target.getAttribute('role') === 'tab') {
      e.preventDefault()
      target.click()
    }
  }
  let seenEnabled = false
  const enhanced = Children.map(children, (child, index) => {
    if (!isValidElement(child)) return child
    if (child.type !== Trigger) return child
    const props = child.props as { value: string; disabled?: boolean }
    const isEnabled = !props.disabled
    const allowTab = props.value === current || (current === '' && isEnabled && !seenEnabled)
    if (isEnabled) seenEnabled = true
    return cloneElement(child as React.ReactElement<{ rovingTabIndex?: number; rovingIndex?: number }>, { rovingTabIndex: allowTab ? 0 : -1, rovingIndex: index })
  })
  return <div ref={listRef} role="tablist" aria-orientation="horizontal" className={`xr-tabs__list xr-tabs__list--${variant} ${className ?? ''}`} style={{ display: 'flex', gap: variant === 'pill' ? 4 : 0, borderBottom: variant === 'underline' ? '1px solid var(--xr-semantic-color-border)' : undefined }} onKeyDown={onKeyDown}>{enhanced}</div>
}
function Trigger({ value, children, disabled, className, rovingTabIndex = -1 }: { value: string; children: ReactNode; disabled?: boolean; className?: string; rovingTabIndex?: number }) {
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
      <button ref={ref} id={`trigger-${value}`} role="tab" aria-selected={isSelected} aria-controls={`panel-${value}`} tabIndex={rovingTabIndex} disabled={disabled}
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