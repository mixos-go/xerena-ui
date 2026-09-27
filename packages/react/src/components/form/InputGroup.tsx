import { useClassName } from '../../primitives/useClassName'
import type { ReactNode } from 'react'
export interface InputGroupProps { children: ReactNode; className?: string }
export function InputGroup({ children, className }: InputGroupProps) {
  return <div className={useClassName({ className }, ['xr-input-group'])} style={{ display: 'flex', gap: 0, borderRadius: 'calc(var(--xr-radius-md) * 1px)', overflow: 'hidden', border: '1px solid var(--xr-semantic-color-border)' }}>{children}</div>
}
