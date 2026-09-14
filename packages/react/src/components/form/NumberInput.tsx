import { useState, useCallback } from 'react'
import { useClassName } from '../../primitives'
export interface NumberInputProps { value?: number; onValueChange?: (n: number) => void; min?: number; max?: number; step?: number; variant?: 'default'|'compact'; disabled?: boolean; className?: string }
export function NumberInput({ value, onValueChange, min = -Infinity, max = Infinity, step = 1, variant = 'default', disabled, className }: NumberInputProps) {
  const [internal, setInternal] = useState(value ?? 0)
  const current = value ?? internal
  const change = useCallback((n: number) => { const clamped = Math.min(max, Math.max(min, n)); setInternal(clamped); onValueChange?.(clamped) }, [min, max, onValueChange])
  return (
    <div className={useClassName({ className }, ['xr-number-input', `xr-number-input--${variant}`])} style={{ display: 'inline-flex', gap: 0 }}>
      {variant === 'compact' && <button type="button" disabled={disabled || current <= min} onClick={() => change(current - step)} aria-label="Decrease" className="xr-number-input__btn xr-number-input__btn--minus">−</button>}
      <input type="number" value={current} min={min} max={max} step={step} disabled={disabled}
        onChange={(e) => change(Number(e.target.value))} role="spinbutton" aria-valuenow={current} aria-valuemin={min} aria-valuemax={max}
        className="xr-number-input__input" style={{ width: 56, textAlign: 'center', border: 'none', background: 'transparent' }} />
      {variant === 'compact' && <button type="button" disabled={disabled || current >= max} onClick={() => change(current + step)} aria-label="Increase" className="xr-number-input__btn xr-number-input__btn--plus">+</button>}
      {variant === 'default' && (
        <div className="xr-number-input__steppers" style={{ display: 'flex', flexDirection: 'column' }}>
          <button type="button" disabled={disabled || current >= max} onClick={() => change(current + step)} aria-label="Increase" className="xr-number-input__btn">↑</button>
          <button type="button" disabled={disabled || current <= min} onClick={() => change(current - step)} aria-label="Decrease" className="xr-number-input__btn">↓</button>
        </div>
      )}
    </div>
  )
}