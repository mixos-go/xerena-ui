import { useClassName } from '../../primitives/useClassName'
export interface SkeletonProps { shape?: 'line'|'circle'|'rect'|'text'; width?: number|string; height?: number|string; style?: React.CSSProperties; className?: string }
export function Skeleton({ shape = 'line', width, height, style, className }: SkeletonProps) {
  return (
    <span role="status" className="xr-skeleton-host">
      <span
        aria-hidden="true"
        style={{ width, height, ...style }}
        className={useClassName({ className }, [`xr-skeleton xr-skeleton--${shape}`])}
      />
    </span>
  )
}
