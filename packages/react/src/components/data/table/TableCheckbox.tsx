import { useRef, useEffect } from 'react'
import { useFocusRing, useClassName } from '../../../primitives'
export interface TableCheckboxProps { checked: boolean | 'indeterminate'; onCheckedChange: (v: boolean) => void; ariaLabel?: string; className?: string }
export function TableCheckbox({ checked, onCheckedChange, ariaLabel = 'Select row', className }: TableCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { if (ref.current) ref.current.indeterminate = checked === 'indeterminate' }, [checked])
  const { focusWithin, onFocus, onBlur } = useFocusRing()
  return <span className={useClassName({ className }, ['xr-table-checkbox', focusWithin && 'xr-table-checkbox--focus'])} style={{ display: 'inline-flex' }}>
    <input ref={ref} type="checkbox" checked={checked === true} aria-checked={checked === 'indeterminate' ? 'mixed' : checked === true ? 'true' : 'false'}
      aria-label={ariaLabel} onChange={(e) => onCheckedChange(e.target.checked)}
      onFocus={onFocus} onBlur={onBlur} className="xr-table-checkbox__input" />
  </span>
}