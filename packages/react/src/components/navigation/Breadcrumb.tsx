import type { ReactNode } from 'react'
const SEPS: Record<string, ReactNode> = { slash: '/', chevron: '›', dot: '·' }
export interface BreadcrumbItemProps { href?: string; current?: boolean; children: ReactNode; separator?: string }
export function Item({ href, current, children, separator = 'slash' }: BreadcrumbItemProps) {
  return (
    <li style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      {href ? <a href={href} aria-current={current ? 'page' : undefined} style={{ color: current ? 'var(--xr-semantic-color-text)' : 'var(--xr-semantic-color-primary)', textDecoration: current ? 'none' : 'underline' }}>{children}</a>
       : <span aria-current="page" style={{ color: 'var(--xr-semantic-color-text)', fontWeight: 600 }}>{children}</span>}
      {!current && <span aria-hidden="true" style={{ color: 'var(--xr-semantic-color-textMuted)' }}>{SEPS[separator] ?? separator}</span>}
    </li>
  )
}
export const Breadcrumb = Object.assign(
  function Breadcrumb({ children, className }: { children: ReactNode; className?: string }) {
    return <nav aria-label="Breadcrumb"><ol style={{ listStyle: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: 0, margin: 0 }} className={className}>{children}</ol></nav>
  },
  { Item },
)
