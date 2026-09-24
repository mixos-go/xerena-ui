import type { ReactNode } from 'react'
import { View, type ViewStyle } from 'react-native'
import { semantic } from '@xerena/tokens'

export interface StackProps {
  orientation?: 'horizontal' | 'vertical' | 'inline'
  spacing?: keyof typeof semantic.spacing
  alignItems?: ViewStyle['alignItems']
  justifyContent?: ViewStyle['justifyContent']
  wrap?: boolean
  as?: React.ElementType
  className?: string
  children: ReactNode
  testID?: string
}

export function Stack({
  orientation = 'vertical',
  spacing: sp = 'md',
  alignItems,
  justifyContent,
  wrap,
  as: Comp = View,
  children,
  testID,
  ...rest
}: StackProps) {
  const style: ViewStyle = {
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    gap: semantic.spacing[sp],
    alignItems,
    justifyContent,
    flexWrap: wrap || orientation === 'inline' ? 'wrap' : undefined,
  }

  return (
    <Comp testID={testID} style={style} {...rest}>
      {children}
    </Comp>
  )
}
