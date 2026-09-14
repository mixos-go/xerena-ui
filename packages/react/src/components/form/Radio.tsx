import { useFocusRing, useClassName } from '../../primitives'
import { useRadioGroupCtx } from './RadioGroup'
import type { ReactNode } from 'react'
export interface RadioProps { value?: string; checked?: boolean; onChange?: () => void; disabled?: boolean; className?: string; name?: string; children?: ReactNode; rovingTabIndex?: number }
export function Radio({ value, checked, onChange, disabled, className, children, rovingTabIndex = -1 }: RadioProps) {
  const { focusWithin, onFocus, onBlur } = useFocusRing()
  const gctx = useRadioGroupCtx()
  const isChecked = checked ?? gctx.value === value
  return (
    <button role="radio" data-value={value} aria-checked={isChecked} disabled={disabled} type="button" tabIndex={rovingTabIndex}
      className={useClassName({ className }, ['xr-radio', focusWithin && 'xr-radio--focus'])}
      onClick={() => { onChange?.(); if (value) gctx.onChange(value) }} onFocus={onFocus} onBlur={onBlur}
      style={{ borderColor: isChecked ? 'var(--xr-semantic-color-primary)' : 'var(--xr-semantic-color-border)' }}
    >
      {isChecked && <span className="xr-radio__dot" />}
      {children}
    </button>
  )
}
;(Radio as unknown as { xrIsRadio?: boolean }).xrIsRadio = true