import { useClassName } from '../../primitives/useClassName'
export interface DividerProps { orientation?: 'horizontal'|'vertical'; variant?: 'solid'|'dashed'; label?: string; className?: string }
export function Divider({ orientation = 'horizontal', variant = 'solid', label, className }: DividerProps) {
  if (label) {
    return (
      <div role="separator" aria-orientation={orientation} className={useClassName({ className }, [`xr-divider xr-divider--${variant} xr-divider--label`])}>
        <span className="xr-divider__line xr-divider__line--left" />
        <span className="xr-divider__label">{label}</span>
        <span className="xr-divider__line xr-divider__line--right" />
      </div>
    )
  }
  return <hr role="separator" aria-orientation={orientation} className={useClassName({ className }, [`xr-divider xr-divider--${orientation} xr-divider--${variant}`])} />
}