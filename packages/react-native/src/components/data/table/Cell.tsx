import { type ReactNode } from 'react'
import { Text, View, type ViewStyle, type TextStyle } from 'react-native'
import { useTableCtx } from './Table'
import { body } from '../../../styles/typography'
import { spacing } from '../../../styles/spacing'

export interface CellProps {
  as?: 'td' | 'th'
  children?: ReactNode
  style?: ViewStyle
  textStyle?: TextStyle
  testID?: string
}

export function Cell({ as = 'td', children, style, textStyle, testID = 'cell' }: CellProps) {
  const { size, colors, cellStyle: contextCellStyle, cellBorderStyle } = useTableCtx()
  const { cellPadding, fontSize } = SIZE_STYLES[size]

  const isHeader = as === 'th'

  const mergedCellStyle: ViewStyle = {
    padding: cellPadding,
    ...contextCellStyle,
    ...cellBorderStyle,
  }

  const contentStyle: ViewStyle = {
    ...mergedCellStyle,
    ...style,
  }

  const textContentStyle: TextStyle = {
    ...body[fontSize],
    ...(isHeader ? { fontWeight: '600' as TextStyle['fontWeight'] } : {}),
    color: colors.text,
    ...textStyle,
  }

  return (
    <View
      testID={testID}
      role={isHeader ? 'columnheader' : 'cell'}
      accessibilityRole={isHeader ? 'header' : undefined}
      style={contentStyle}
    >
      <Text style={textContentStyle}>{children}</Text>
    </View>
  )
}

const SIZE_STYLES: Record<NonNullable<ReturnType<typeof useTableCtx>['size']>, { cellPadding: number; fontSize: keyof typeof body }> = {
  sm: { cellPadding: spacing[1], fontSize: 'sm' },
  md: { cellPadding: spacing[2], fontSize: 'md' },
  lg: { cellPadding: spacing[3], fontSize: 'lg' },
}