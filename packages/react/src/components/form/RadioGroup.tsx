import { Children, cloneElement, isValidElement, useCallback, useContext, createContext, useState, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
const GroupCtx = createContext<{ value: string; onChange: (v: string) => void }>({ value: '', onChange: () => {} })
export const useRadioGroupCtx = () => useContext(GroupCtx)
const isRadioElement = (type: unknown) => (typeof type === 'function' && (type as { xrIsRadio?: boolean }).xrIsRadio) === true
export interface RadioGroupProps { value?: string; onValueChange?: (v: string) => void; orientation?: 'horizontal'|'vertical'; disabled?: boolean; children: ReactNode; className?: string }
export function RadioGroup({ value, onValueChange, orientation = 'vertical', disabled, children, className }: RadioGroupProps) {
  const [internal, setInternal] = useState('')
  const current = value ?? internal
  const onChange = useCallback((v: string) => { setInternal(v); onValueChange?.(v) }, [onValueChange])
  const groupRef = useRef<HTMLDivElement>(null)
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const radios = Array.from(groupRef.current?.querySelectorAll<HTMLElement>('[role="radio"]:not(:disabled)') ?? [])
    if (radios.length === 0) return
    let idx = radios.indexOf(e.target as HTMLElement)
    if (idx === -1) idx = radios.findIndex(r => r.getAttribute('aria-checked') === 'true')
    if (idx === -1) idx = 0
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); idx = Math.min(idx + 1, radios.length - 1) }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); idx = Math.max(idx - 1, 0) }
    else if (e.key === 'Home') { e.preventDefault(); idx = 0 }
    else if (e.key === 'End') { e.preventDefault(); idx = radios.length - 1 }
    else { return }
    const next = radios[idx]
    if (next) {
      next.focus()
      const nextValue = next.getAttribute('data-value')
      if (nextValue !== null && nextValue !== undefined && nextValue !== '') onChange(nextValue)
    }
  }
  let seenEnabled = false
  const enhanced = Children.map(children, (child) => {
    if (!isValidElement(child)) return child
    if (!isRadioElement(child.type)) return child
    const props = child.props as { value?: string; checked?: boolean; disabled?: boolean }
    const isEnabled = !props.disabled
    const isChecked = props.checked ?? props.value === current
    const allowTab = isChecked || (current === '' && isEnabled && !seenEnabled)
    if (isEnabled) seenEnabled = true
    return cloneElement(child as React.ReactElement<{ rovingTabIndex?: number }>, { rovingTabIndex: allowTab ? 0 : -1 })
  })
  return (
    <GroupCtx.Provider value={{ value: current, onChange }}>
      <div ref={groupRef} role="radiogroup" aria-orientation={orientation} aria-disabled={disabled ? true : undefined}
        className={`xr-radiogroup xr-radiogroup--${orientation} ${className ?? ''}`}
        style={{ display: 'flex', flexDirection: orientation === 'horizontal' ? 'row' : 'column', gap: '8px' }} onKeyDown={onKeyDown}>
        {enhanced}
      </div>
    </GroupCtx.Provider>
  )
}