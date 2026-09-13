import { useCallback, useState } from 'react'
import { useFocusRing, useClassName } from '../../primitives'
export interface SwitchProps { checked?: boolean; onCheckedChange?: (checked: boolean) => void; size?: 'sm' | 'md'; disabled?: boolean; className?: string }
export function Switch({ checked: controlled, onCheckedChange, size = 'md', disabled, className }: SwitchProps) {
  const [uncontrolled, setUncontrolled] = useState(false)
  const checked = controlled ?? uncontrolled
  const toggle = useCallback(() => {
    if (onCheckedChange) onCheckedChange(!checked)
    else setUncontrolled(!checked)
  }, [checked, onCheckedChange])
  const { focusWithin, onFocus, onBlur } = useFocusRing()
  const thumbPx = size === 'sm' ? 27 : 32
  return (
    <button role="switch" aria-checked={checked} disabled={disabled} type="button"
      className={useClassName({ className }, ['xr-switch', `xr-switch--${size}`, focusWithin && 'xr-switch--focus'])}
      style={{ '--xr-switch-thumb': `${thumbPx}px`, backgroundColor: checked ? 'var(--xr-semantic-color-primary)' : 'var(--xr-semantic-color-border)' } as React.CSSProperties}
      onClick={toggle} onFocus={onFocus} onBlur={onBlur}
    >
      <span className="xr-switch__thumb" style={{ transform: checked ? `translateX(${thumbPx}px)` : 'translateX(0)' }} />
    </button>
  )
}