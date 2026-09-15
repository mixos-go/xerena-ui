import { Children, cloneElement, isValidElement } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { View, type ViewStyle } from 'react-native'
import { semantic } from '@xerena/tokens'
import { useControllableState } from '../../hooks/useControllableState'

export interface ButtonGroupProps {
  orientation?: 'horizontal' | 'vertical'
  spacing?: keyof typeof semantic.spacing
  value?: string
  onValueChange?: (v: string) => void
  className?: string
  children: ReactNode
  testID?: string
}

export function ButtonGroup({
  orientation = 'horizontal',
  spacing: sp = 'md',
  value,
  onValueChange,
  children,
  testID,
}: ButtonGroupProps) {
  const [current, setCurrent] = useControllableState<string | undefined>(value, undefined, onValueChange)

  const style: ViewStyle = {
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    gap: semantic.spacing[sp],
  }

  const enhanced = Children.map(children, (child) => {
    if (!isValidElement(child)) return child
    const props = child.props as { value?: string; onPress?: () => void }
    if (props.value === undefined) return child
    return cloneElement(child as ReactElement<{ selected?: boolean; onPress?: () => void }>, {
      selected: props.value === current,
      onPress: () => {
        props.onPress?.()
        setCurrent(props.value as string)
      },
    })
  })

  return (
    <View testID={testID} accessibilityRole="button" accessibilityState={{ expanded: false }} style={style}>
      {enhanced}
    </View>
  )
}
