import { Slot } from '../../primitives/Slot'
import { useClassName } from '../../primitives/useClassName'
export interface LinkProps { variant?: 'default' | 'muted' | 'animated'; href?: string; target?: '_blank'; rel?: string; asChild?: boolean; className?: string; children: React.ReactNode }
export function Link({ variant = 'default', asChild, className, children, ...rest }: LinkProps) {
  const Comp = asChild ? Slot : 'a'
  return <Comp className={useClassName({ className }, [`xr-link`, `xr-link--${variant}`])} {...rest}>{children}</Comp>
}
