import { useCallback } from 'react'
import { useDisabled, useClassName } from '../../primitives'
export interface SliderProps { value?: number; defaultValue?: number; min?: number; max?: number; step?: number; orientation?: 'horizontal'|'vertical'; onValueChange?: (v: number) => void; disabled?: boolean; className?: string }
export function Slider({ value, defaultValue = 0, min = 0, max = 100, step = 1, orientation = 'horizontal', onValueChange, disabled, className }: SliderProps) {
  const { disabled: isDisabled } = useDisabled(disabled)
  const pct = ((value ?? defaultValue) - min) / (max - min) * 100
  const set = useCallback((n: number) => { if (onValueChange) onValueChange(n) }, [onValueChange])
  return (
    <div className={useClassName({ className }, ['xr-slider', `xr-slider--${orientation}`])} role="presentation"
      style={{ position: 'relative', width: orientation === 'horizontal' ? '100%' : 20, height: orientation === 'horizontal' ? 20 : 100 }}>
      <div className="xr-slider__track" style={{ position: 'absolute', inset: 0, borderRadius: 4, background: 'var(--xr-semantic-color-border)' }} />
      <div className="xr-slider__fill" style={{ position: 'absolute', borderRadius: 4, background: 'var(--xr-semantic-color-primary)', ...(orientation === 'horizontal' ? { left: 0, width: `${pct}%`, top: 0, bottom: 0 } : { top: 0, height: `${pct}%`, left: 0, right: 0 }) }} />
      <input type="range" min={min} max={max} step={step} value={value ?? defaultValue} disabled={isDisabled}
        onChange={(e) => set(Number(e.target.value))}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', margin: 0, opacity: 0, cursor: 'pointer' }}
        aria-label="Slider" role="slider"
        aria-valuemin={min} aria-valuemax={max} aria-valuenow={value ?? defaultValue}
      />
    </div>
  )
}
