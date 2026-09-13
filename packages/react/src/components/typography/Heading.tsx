import { Slot } from '../../primitives/Slot'
import { useClassName } from '../../primitives/useClassName'
export interface HeadingProps { as?: 'h1'|'h2'|'h3'|'h4'|'h5'|'h6'; asChild?: boolean; className?: string; children: React.ReactNode }
export function Heading({ as = 'h2', asChild, className, children, ...rest }: HeadingProps) {
  const Comp = asChild ? Slot : as
  return <Comp className={useClassName({ className }, [`xr-heading`, `xr-heading--${as}`])} {...rest}>{children}</Comp>
}