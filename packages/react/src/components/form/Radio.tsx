import { useFocusRing, useClassName } from '../../primitives'
import { useRadioGroupCtx } from './RadioGroup'
import type { ReactNode } from 'react'
export interface RadioProps { value?: string; checked?: boolean; onChange?: () => void; disabled?: boolean; className?: string; name?: string; children?: ReactNode }
export function Radio({ value, checked, onChange, disabled, className, children }: RadioProps) {
  const { focusWithin, onFocus, onBlur } = useFocusRing()
  const gctx = useRadioGroupCtx()
  return (
    <button role="radio" aria-checked={checked} disabled={disabled} type="button"
      className={useClassName({ className }, ['xr-radio', focusWithin && 'xr-radio--focus'])}
      onClick={() => { onChange?.(); gctx.onChange(value ?? '') }} onFocus={onFocus} onBlur={onBlur}
      style={{ borderColor: checked ? 'var(--xr-semantic-color-primary)' : 'var(--xr-semantic-color-border)' }}
    >
      {checked && <span className="xr-radio__dot" />}
      {children}
    </button>
  )
}