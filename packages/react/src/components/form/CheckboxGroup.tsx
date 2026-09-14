import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
const Ctx = createContext<{ value: string[]; toggle: (v: string) => void }>({ value: [], toggle: () => {} })
export const useCheckboxGroupCtx = () => useContext(Ctx)
export interface CheckboxGroupProps { value?: string[]; onValueChange?: (v: string[]) => void; disabled?: boolean; children: ReactNode; className?: string }
export function CheckboxGroup({ value, onValueChange, children, className }: CheckboxGroupProps) {
  const [internal, setInternal] = useState<string[]>([])
  const val = value ?? internal
  const toggle = useCallback((v: string) => { const next = val.includes(v) ? val.filter(x => x !== v) : [...val, v]; if (onValueChange) onValueChange(next); else setInternal(next) }, [val, onValueChange])
  return <Ctx.Provider value={{ value: val, toggle }}><div className={`xr-checkbox-group ${className ?? ''}`} role="group">{children}</div></Ctx.Provider>
}