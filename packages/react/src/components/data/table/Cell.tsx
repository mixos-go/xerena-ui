import type { ReactNode, ComponentPropsWithoutRef } from 'react'
export interface CellProps extends Omit<ComponentPropsWithoutRef<'td'>, 'as'> { as?: 'td' | 'th'; children?: ReactNode; className?: string }
export function Cell({ as, children, className, ...rest }: CellProps) {
  const Comp = as === 'th' ? 'th' : 'td'
  return <Comp className={className} scope={as === 'th' ? 'col' : undefined} {...rest}>{children}</Comp>
}