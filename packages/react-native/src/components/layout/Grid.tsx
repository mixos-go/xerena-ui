import { Children, cloneElement, isValidElement } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { View, type ViewStyle } from 'react-native'
import { semantic } from '@xerena/tokens'

export interface GridProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  gap?: keyof typeof semantic.spacing
  auto?: boolean
  as?: React.ElementType
  className?: string
  children: ReactNode
  testID?: string
}

export function Grid({ columns, gap: g = 'md', auto, as: Comp = View, children, testID, ...rest }: GridProps) {
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: semantic.spacing[g],
  }

  const childStyle: ViewStyle = auto
    ? { flex: 1 }
    : columns
      ? { flexBasis: `${100 / columns}%` }
      : {}

  const enhanced = Children.map(children, (child) => {
    if (!isValidElement(child)) return child
    return cloneElement(child as ReactElement<{ style?: ViewStyle }>, {
      style: [childStyle, child.props.style],
    })
  })

  return (
    <Comp testID={testID} style={containerStyle} {...rest}>
      {enhanced}
    </Comp>
  )
}
