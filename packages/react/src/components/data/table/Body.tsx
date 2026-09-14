import type { ReactNode } from 'react'
export function Body({ children, className }: { children: ReactNode; className?: string }) {
  return <tbody className={className}>{children}</tbody>
}