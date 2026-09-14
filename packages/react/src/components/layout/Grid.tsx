import { semantic } from '@xerena/tokens'
import { useClassName } from '../../primitives'
export interface GridProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  gap?: keyof typeof semantic.spacing
  auto?: boolean
  className?: string
  children: React.ReactNode
}
export function Grid({ columns, gap: g = 'md', auto, className, children, ...rest }: GridProps) {
  const style: React.CSSProperties = {
    display: 'grid',
    gap: `${semantic.spacing[g]}px`,
    gridTemplateColumns: auto ? 'repeat(auto-fit, minmax(0,1fr))' : columns ? `repeat(${columns}, minmax(0,1fr))` : undefined,
  }
  return (
    <div className={useClassName({ className }, [`xr-grid xr-grid--${columns ?? 'auto'}`])} style={style} {...rest}>
      {children}
    </div>
  )
}
