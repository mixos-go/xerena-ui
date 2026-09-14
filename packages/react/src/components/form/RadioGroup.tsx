import { useCallback, useContext, createContext } from 'react'
import type { ReactNode } from 'react'
const GroupCtx = createContext<{ value: string; onChange: (v: string) => void }>({ value: '', onChange: () => {} })
export const useRadioGroupCtx = () => useContext(GroupCtx)
export interface RadioGroupProps { value?: string; onValueChange?: (v: string) => void; orientation?: 'horizontal'|'vertical'; disabled?: boolean; children: ReactNode; className?: string }
export function RadioGroup({ value = '', onValueChange, orientation = 'vertical', children, className }: RadioGroupProps) {
  const onChange = useCallback((v: string) => { onValueChange?.(v) }, [onValueChange])
  return (
    <GroupCtx.Provider value={{ value, onChange }}>
      <div role="radiogroup" aria-orientation={orientation}
        className={`xr-radiogroup xr-radiogroup--${orientation} ${className ?? ''}`}
        style={{ display: 'flex', flexDirection: orientation === 'horizontal' ? 'row' : 'column', gap: '8px' }}>
        {children}
      </div>
    </GroupCtx.Provider>
  )
}