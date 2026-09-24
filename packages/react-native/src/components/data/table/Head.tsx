import { type ReactNode, Children, isValidElement, cloneElement } from 'react'
import { StyleSheet, View, type ViewStyle } from 'react-native'
import { useTableCtx } from './Table'
import { spacing } from '../../../styles/spacing'
import { body } from '../../../styles/typography'

export interface HeadProps {
  children: ReactNode
  style?: ViewStyle
  testID?: string
}

export function Head({ children, style, testID = 'head' }: HeadProps) {
  const { variant, size, frozenHeader, colors, headStyle, cellBorderStyle } = useTableCtx()
  const { cellPadding, fontSize } = SIZE_STYLES[size]

  const headCellStyle: ViewStyle = {
    padding: cellPadding,
    ...cellBorderStyle,
    ...body[fontSize],
  }

  const contentStyle: ViewStyle = frozenHeader
    ? {
        ...headStyle,
        // position: 'sticky' not supported in RN; header freezing handled via scroll container
      }
    : headStyle

  return (
    <View
      testID={testID}
      accessibilityRole="header"
      style={[styles.row, contentStyle, style]}
    >
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child
        return cloneElement(
          child as React.ReactElement<{ colors?: unknown; variant?: unknown; size?: unknown; cellStyle?: unknown }>,
          {
            colors,
            variant,
            size,
            cellStyle: headCellStyle,
          },
        )
      })}
    </View>
  )
}

const SIZE_STYLES: Record<NonNullable<ReturnType<typeof useTableCtx>['size']>, { cellPadding: number; fontSize: keyof typeof body }> = {
  sm: { cellPadding: spacing[1], fontSize: 'sm' },
  md: { cellPadding: spacing[2], fontSize: 'md' },
  lg: { cellPadding: spacing[3], fontSize: 'lg' },
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
})