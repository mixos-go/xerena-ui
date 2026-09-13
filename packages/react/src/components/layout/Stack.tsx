import { semantic } from '@xerena/tokens'
import { useClassName } from '../../primitives'
export interface StackProps {
  orientation?: 'horizontal' | 'vertical' | 'inline'
  spacing?: keyof typeof semantic.spacing
  alignItems?: React.CSSProperties['alignItems']
  justifyContent?: React.CSSProperties['justifyContent']
  wrap?: boolean
  as?: React.ElementType
  className?: string
  children: React.ReactNode
}
export function Stack({ orientation = 'vertical', spacing: sp = 'md', alignItems, justifyContent, wrap, as: Comp = 'div', className, children, ...rest }: StackProps) {
  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: orientation === 'horizontal' ? 'row' : orientation === 'vertical' ? 'column' : 'row',
    gap: semantic.spacing[sp] ? `${semantic.spacing[sp]}px` : undefined,
    alignItems,
    justifyContent,
    flexWrap: wrap ? 'wrap' : undefined,
  }
  return (
    <Comp className={useClassName({ className }, [`xr-stack xr-stack--${orientation}`])} style={style} {...rest}>
      {children}
    </Comp>
  )
}