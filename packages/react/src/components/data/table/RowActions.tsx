import type { ReactNode } from 'react'
import { useClassName } from '../../../primitives/useClassName'
export interface RowActionsProps { children: ReactNode; actionsPosition?: 'left' | 'right'; sticky?: boolean; className?: string }
export function RowActions({ children, actionsPosition = 'right', sticky = false, className }: RowActionsProps) {
  return (
    <td className={useClassName({ className }, [`xr-row-actions xr-row-actions--${actionsPosition}`, sticky && 'xr-row-actions--sticky'])}
        style={{ position: sticky ? 'sticky' : undefined, right: sticky ? 0 : undefined, background: 'var(--xr-semantic-color-background)' }}>
      <div style={{ display: 'flex', gap: 4 }}>{children}</div>
    </td>
  )
}
