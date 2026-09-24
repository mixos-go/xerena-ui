import { createContext, useContext, type ReactNode, Children, isValidElement, cloneElement } from 'react'
import { StyleSheet, Text, View, ScrollView, type ViewStyle, Easing } from 'react-native'
import { useNativeColors } from '../../../hooks/useNativeColors'
import { useNativeMotion } from '../../../hooks/useNativeMotion'
import { spacing } from '../../../styles/spacing'
import { radius } from '../../../styles/radius'
import { body } from '../../../styles/typography'

type TableVariant = 'striped' | 'outlined' | 'grid' | 'hover'
type TableSize = 'sm' | 'md' | 'lg'

interface TableContextValue {
  variant: TableVariant
  size: TableSize
  frozenHeader: boolean
  colors: ReturnType<typeof useNativeColors>
  animate: ReturnType<typeof useNativeMotion>['animate']
  reduced: boolean
  tableStyle: ViewStyle
  headStyle: ViewStyle
  cellStyle: ViewStyle
  cellBorderStyle: ViewStyle
  stripedStyle: ViewStyle
}

const TableContext = createContext<TableContextValue>({
  variant: 'outlined',
  size: 'md',
  frozenHeader: false,
  colors: {} as ReturnType<typeof useNativeColors>,
  animate: () => ({ toValue: 0, duration: 0, easing: Easing.linear, useNativeDriver: false }),
  reduced: false,
  tableStyle: {},
  headStyle: {},
  cellStyle: {},
  cellBorderStyle: {},
  stripedStyle: {},
})

export const useTableCtx = () => useContext(TableContext)

const SIZE_STYLES: Record<TableSize, { cellPadding: number; fontSize: keyof typeof body }> = {
  sm: { cellPadding: spacing[1], fontSize: 'sm' },
  md: { cellPadding: spacing[2], fontSize: 'md' },
  lg: { cellPadding: spacing[3], fontSize: 'lg' },
}

export interface TableProps {
  variant?: TableVariant
  size?: TableSize
  frozenHeader?: boolean
  maxHeight?: number | string
  children: ReactNode
  testID?: string
}

export function Table({
  variant = 'outlined',
  size = 'md',
  frozenHeader = false,
  maxHeight,
  children,
  testID = 'table-root',
}: TableProps) {
  const colors = useNativeColors()
  const { animate, reduced } = useNativeMotion()

  const containerStyle: ViewStyle = {
    maxHeight: typeof maxHeight === 'number' ? maxHeight : undefined,
    overflow: maxHeight ? 'hidden' : 'visible',
  }

  const tableStyle: ViewStyle = {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: variant === 'outlined' ? 1 : 0,
    borderRadius: radius.md,
    overflow: frozenHeader ? 'hidden' : 'visible',
  }

  const headStyle: ViewStyle = {
    backgroundColor: colors.background,
    borderBottomWidth: variant === 'outlined' || variant === 'grid' ? 1 : 0,
    borderBottomColor: colors.border,
  }

  const cellBorderStyle: ViewStyle = variant === 'grid'
    ? { borderWidth: 1, borderColor: colors.border }
    : {}

  const stripedStyle: ViewStyle = variant === 'striped' ? { backgroundColor: colors.surface } : {}

  const cellStyle: ViewStyle = {
    padding: SIZE_STYLES[size].cellPadding,
  }

  const contextValue: TableContextValue = {
    variant,
    size,
    frozenHeader,
    colors,
    animate,
    reduced,
    tableStyle,
    headStyle,
    cellStyle,
    cellBorderStyle,
    stripedStyle,
  }

  const scrollStyle: ViewStyle = {
    maxHeight: typeof maxHeight === 'number' ? maxHeight : undefined,
  }

  if (frozenHeader) {
    return (
      <TableContext.Provider value={contextValue}>
        <View
          testID={testID}
          role="grid"
          accessibilityLabel="Data table"
          style={styles.container}
        >
          <ScrollView
            testID={`${testID}-scroll`}
            stickyHeaderIndices={[0]}
            style={scrollStyle}
          >
            {children}
          </ScrollView>
        </View>
      </TableContext.Provider>
    )
  }

  return (
    <TableContext.Provider value={contextValue}>
      <View
        testID={testID}
        role="grid"
        accessibilityLabel="Data table"
        style={[styles.container, containerStyle]}
      >
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return child
          return cloneElement(child as React.ReactElement)
        })}
      </View>
    </TableContext.Provider>
  )
}

export function Caption({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const colors = useNativeColors()
  return (
    <Text
      accessibilityRole="text"
      style={[
        styles.caption,
        { color: colors.textMuted, marginBottom: spacing[2] },
        style,
      ]}
    >
      {children}
    </Text>
  )
}

Table.Caption = Caption

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  caption: {
    ...body.sm,
  },
})