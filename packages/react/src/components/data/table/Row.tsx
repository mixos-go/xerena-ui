import { useState, useCallback } from 'react'
import { useClassName } from '../../../primitives/useClassName'
import type { ReactNode } from 'react'
export interface RowProps { expandable?: boolean; expandContent?: ReactNode; className?: string; children: ReactNode }
export function Row({ expandable, expandContent, className, children }: RowProps) {
  const [expanded, setExpanded] = useState(false)
  const toggle = useCallback(() => setExpanded(p => !p), [])
  return (
    <>
      <tr role="row" className={useClassName({ className }, [`xr-table-row ${expandable ? 'xr-table-row--expandable' : ''}`])} aria-expanded={expandable ? expanded : undefined}>
        {expandable && <td className="xr-table-row__expand" onClick={toggle} style={{ cursor: 'pointer', width: 32, textAlign: 'center' }} aria-label="Toggle expand">
          <span style={{ display: 'inline-block', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform calc(var(--xr-motion-duration-fast) * 1ms) cubic-bezier(var(--xr-motion-easing-standard))' }}>›</span>
        </td>}
        {children}
      </tr>
      {expanded && expandContent && (
        <tr className="xr-table-row__expanded">
          <td colSpan={99} style={{ padding: '12px 16px', background: 'var(--xr-semantic-color-surface)' }}>{expandContent}</td>
        </tr>
      )}
    </>
  )
}
