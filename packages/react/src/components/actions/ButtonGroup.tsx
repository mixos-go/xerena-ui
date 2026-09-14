import { Children, cloneElement, isValidElement, useCallback, useState } from 'react'
import { useClassName } from '../../primitives/useClassName'
import { semantic } from '@xerena/tokens'
export interface ButtonGroupProps { orientation?: 'horizontal' | 'vertical'; spacing?: keyof typeof semantic.spacing; value?: string; onValueChange?: (v: string) => void; className?: string; children: React.ReactNode }
export function ButtonGroup({ orientation = 'horizontal', spacing: sp = 'md', value, onValueChange, className, children }: ButtonGroupProps) {
  const [internal, setInternal] = useState('')
  const current = value ?? internal
  const onChange = useCallback((v: string) => { setInternal(v); onValueChange?.(v) }, [onValueChange])
  const enhanced = Children.map(children, child => {
    if (!isValidElement(child)) return child
    const props = child.props as { value?: string; onClick?: () => void }
    if (props.value === undefined) return child
    return cloneElement(child as React.ReactElement<{ selected?: boolean; onClick?: () => void }>, {
      selected: props.value === current,
      onClick: () => { props.onClick?.(); onChange(props.value!) },
    })
  })
  const style: React.CSSProperties = { display: 'flex', flexDirection: orientation === 'vertical' ? 'column' : 'row', gap: semantic.spacing[sp] ? `${semantic.spacing[sp]}px` : undefined }
  return <div role="group" className={useClassName({ className }, [`xr-button-group xr-button-group--${orientation}`])} style={style}>{enhanced}</div>
}
