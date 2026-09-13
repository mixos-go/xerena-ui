import { useClassName } from '../../primitives/useClassName'
import { semantic } from '@xerena/tokens'
export interface ButtonGroupProps { orientation?: 'horizontal' | 'vertical'; spacing?: keyof typeof semantic.spacing; value?: string; onValueChange?: (v: string) => void; className?: string; children: React.ReactNode }
export function ButtonGroup({ orientation = 'horizontal', spacing: sp = 'md', className, children, ...rest }: ButtonGroupProps) {
  const style: React.CSSProperties = { display: 'flex', flexDirection: orientation === 'vertical' ? 'column' : 'row', gap: semantic.spacing[sp] ? `${semantic.spacing[sp]}px` : undefined }
  return <div role="group" className={useClassName({ className }, [`xr-button-group xr-button-group--${orientation}`])} style={style} {...rest}>{children}</div>
}