import { useCallback, useState } from 'react'
import { useFocusRing, useClassName } from '../../primitives'
export interface CheckboxProps { checked?: boolean; onCheckedChange?: (checked: boolean) => void; disabled?: boolean; className?: string; children?: React.ReactNode }
export function Checkbox({ checked: controlled, onCheckedChange, disabled, className }: CheckboxProps) {
  const [uncontrolled, setUncontrolled] = useState(false)
  const checked = controlled ?? uncontrolled
  const onChange = useCallback(() => {
    if (onCheckedChange) onCheckedChange(!checked)
    else setUncontrolled(!checked)
  }, [checked, onCheckedChange])
  const { focusWithin, onFocus, onBlur } = useFocusRing()
  return (
    <button role="checkbox" aria-checked={checked} disabled={disabled}
      className={useClassName({ className }, ['xr-checkbox', focusWithin && 'xr-checkbox--focus'])}
      style={{ borderColor: checked ? 'var(--xr-semantic-color-primary)' : 'var(--xr-semantic-color-border)' }}
      onClick={onChange} onFocus={onFocus} onBlur={onBlur}
      type="button"
    >
      {checked && <span className="xr-checkbox__check" aria-hidden="true">✓</span>}
    </button>
  )
}
