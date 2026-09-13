import { useFocusRing, useClassName } from '../../primitives'
export interface RadioProps { value?: string; checked?: boolean; onChange?: () => void; disabled?: boolean; className?: string; name?: string }
export function Radio({ checked, onChange, disabled, className }: RadioProps) {
  const { focusWithin, onFocus, onBlur } = useFocusRing()
  return (
    <button role="radio" aria-checked={checked} disabled={disabled} type="button"
      className={useClassName({ className }, ['xr-radio', focusWithin && 'xr-radio--focus'])}
      onClick={onChange} onFocus={onFocus} onBlur={onBlur}
      style={{ borderColor: checked ? 'var(--xr-semantic-color-primary)' : 'var(--xr-semantic-color-border)' }}
    >
      {checked && <span className="xr-radio__dot" />}
    </button>
  )
}