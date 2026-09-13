import { useClassName } from '../../primitives/useClassName'
export interface LinkProps { variant?: 'default' | 'muted' | 'animated'; href?: string; target?: '_blank'; rel?: string; asChild?: boolean; className?: string; children: React.ReactNode }
export function Link({ variant = 'default', className, children, ...rest }: LinkProps) {
  return <a className={useClassName({ className }, [`xr-link`, `xr-link--${variant}`])} {...rest}>{children}</a>
}