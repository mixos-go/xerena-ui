import { useTableCtx } from './Table'
import type { ReactNode } from 'react'
export function Head({ children, className }: { children: ReactNode; className?: string }) {
  const { frozenHeader } = useTableCtx()
  return <thead className={className} style={frozenHeader ? { position: 'sticky', top: 0, zIndex: 1, background: 'var(--xr-semantic-color-background)' } : undefined}>{children}</thead>
}