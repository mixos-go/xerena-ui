import { useClassName } from '../../primitives/useClassName'
export function Kbd({ className, children, ...rest }: { className?: string; children: React.ReactNode }) {
  return <kbd className={useClassName({ className }, ['xr-kbd'])} {...rest}>{children}</kbd>
}