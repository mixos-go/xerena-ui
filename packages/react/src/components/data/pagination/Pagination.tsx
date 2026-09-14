import { useCallback, useState } from 'react'
import { useClassName } from '../../../primitives'
import { PreviewPopover } from '../../../primitives/PreviewPopover'
import type { ReactNode } from 'react'
export interface PaginationProps { total: number; pageSize: number; current: number; onChange: (page: number) => void; siblingCount?: number; variant?: 'page'|'simple'; renderPagePreview?: (page: number) => ReactNode; className?: string }
export function Pagination({ total, pageSize, current, onChange, siblingCount = 1, variant = 'page', renderPagePreview, className }: PaginationProps) {
  const pages = Math.ceil(total / pageSize)
  const [hoveredPage, setHoveredPage] = useState<number | null>(null)
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const onLeave = useCallback(() => { setHoveredPage(null); setAnchor(null) }, [])
  if (variant === 'simple') {
    return <nav aria-label="Pagination" className={useClassName({ className }, ['xr-pagination xr-pagination--simple'])}><span>1 / {pages}</span><button onClick={() => onChange(current + 1)} disabled={current >= pages} aria-label="Next">→</button></nav>
  }
  const range: (number | 'ellipsis')[] = []
  const left = Math.max(1, current - siblingCount)
  const right = Math.min(pages, current + siblingCount)
  if (left > 2) range.push(1)
  else for (let i = 1; i < left; i++) range.push(i)
  for (let i = left; i <= right; i++) range.push(i)
  if (right < pages - 1) range.push('ellipsis')
  else for (let i = right + 1; i <= pages; i++) range.push(i)
  return (
    <nav aria-label="Pagination" className={useClassName({ className }, ['xr-pagination'])}>
      <button disabled={current <= 1} onClick={() => onChange(current - 1)} aria-label="Previous">←</button>
      <ul style={{ listStyle: 'none', display: 'flex', gap: 4, padding: 0, margin: 0 }}>
        {range.map((p, i) => (
          p === 'ellipsis' ? <li key={`e${i}`} style={{ paddingInline: 4, color: 'var(--xr-semantic-color-textMuted)' }}>…</li> : (
            <li key={p} style={{ position: 'relative' }}>
              <button
                aria-current={p === current ? 'page' : undefined}
                onClick={() => onChange(p as number)}
                onMouseEnter={(e) => { if (renderPagePreview) { setHoveredPage(p as number); setAnchor(e.currentTarget) } }}
                onMouseLeave={onLeave}
                onFocus={(e) => { if (renderPagePreview) { setHoveredPage(p as number); setAnchor(e.currentTarget) } }}
                onBlur={onLeave}
                className="xr-pagination__page"
                style={{ paddingInline: 8, border: p === current ? '1px solid var(--xr-semantic-color-primary)' : '1px solid transparent', borderRadius: 'var(--xr-radius-md)', background: p === current ? 'var(--xr-semantic-color-primary)' : 'transparent', color: p === current ? 'var(--xr-semantic-color-textOnStrong)' : 'var(--xr-semantic-color-text)' }}
              >{p}</button>
            </li>
          )
        ))}
      </ul>
      <button disabled={current >= pages} onClick={() => onChange(current + 1)} aria-label="Next">→</button>
      <PreviewPopover open={hoveredPage !== null && !!renderPagePreview} label={`Page ${hoveredPage}`} anchor={anchor}>
        {hoveredPage !== null && renderPagePreview?.(hoveredPage)}
      </PreviewPopover>
    </nav>
  )
}