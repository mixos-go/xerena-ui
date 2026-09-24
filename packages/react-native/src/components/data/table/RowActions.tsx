import { type ReactNode } from 'react'
import { View, type ViewStyle } from 'react-native'
import { useTableCtx } from './Table'
import { spacing } from '../../../styles/spacing'

export interface RowActionsProps {
  children: ReactNode
  actionsPosition?: 'left' | 'right'
  sticky?: boolean
  style?: ViewStyle
  testID?: string
}

export function RowActions({
  children,
  actionsPosition = 'right',
  sticky = false,
  style,
  testID = 'actions',
}: RowActionsProps) {
  const { colors, cellBorderStyle } = useTableCtx()

  const cellStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    padding: spacing[1],
    ...cellBorderStyle,
    ...(sticky
      ? {
          position: 'absolute',
          right: actionsPosition === 'right' ? 0 : undefined,
          left: actionsPosition === 'left' ? 0 : undefined,
          backgroundColor: colors.background,
          zIndex: 10,
        }
      : {}),
    ...style,
  }

  return <View testID={testID} style={cellStyle}>{children}</View>
}