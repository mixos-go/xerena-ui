import { useState, useCallback, useRef, useEffect, type ReactNode, Children, isValidElement, cloneElement } from 'react'
import { Animated, StyleSheet, Text, View, type ViewStyle } from 'react-native'
import { Pressable } from '../../../primitives/Pressable'
import { useTableCtx } from './Table'
import { spacing } from '../../../styles/spacing'
import { body } from '../../../styles/typography'

export interface RowProps {
  expandable?: boolean
  expandContent?: ReactNode
  children: ReactNode
  style?: ViewStyle
  testID?: string
}

export function Row({ expandable = false, expandContent, children, style, testID = 'row' }: RowProps) {
  const { variant, size, colors, cellBorderStyle, stripedStyle, animate, reduced } = useTableCtx()
  const { cellPadding, fontSize } = SIZE_STYLES[size]
  const [expanded, setExpanded] = useState(false)
  const expandAnimation = useRef(new Animated.Value(0)).current
  const wasExpanded = useRef(expanded)

  const toggle = useCallback(() => setExpanded((p) => !p), [])

  useEffect(() => {
    if (expanded && !wasExpanded.current) {
      Animated.timing(expandAnimation, animate({ toValue: 1, duration: 'fast', easing: 'standard' })).start()
    } else if (!expanded && wasExpanded.current) {
      if (reduced) {
        expandAnimation.setValue(0)
      } else {
        Animated.timing(expandAnimation, animate({ toValue: 0, duration: 'emphatic', easing: 'exit' })).start()
      }
    }
    wasExpanded.current = expanded
  }, [expanded, animate, reduced, expandAnimation])

  const rowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderBottomWidth: variant === 'outlined' || variant === 'grid' ? 1 : 0,
    borderBottomColor: colors.border,
    ...(expandable ? stripedStyle : {}),
  }

  const expandCellStyle: ViewStyle = {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    padding: cellPadding,
    ...cellBorderStyle,
  }

  const cellStyle: ViewStyle = {
    flex: 1,
    padding: cellPadding,
    ...cellBorderStyle,
    ...body[fontSize],
  }

  return (
    <View style={style}>
      <Pressable
        testID={testID}
        role="row"
        accessibilityLabel="Table row"
        accessibilityState={{ expanded: expandable ? expanded : undefined }}
        onPress={expandable ? toggle : undefined}
        style={rowStyle}
      >
        {expandable && (
          <View style={expandCellStyle}>
            <Animated.View
              style={[
                styles.expandIcon,
                {
                  transform: [{ rotate: expandAnimation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '90deg'] }) }],
                },
              ]}
            >
              <Text style={body[fontSize]}>›</Text>
            </Animated.View>
          </View>
        )}
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return child
          return cloneElement(
            child as React.ReactElement<{ colors?: unknown; variant?: unknown; size?: unknown; cellStyle?: unknown }>,
            {
              colors,
              variant,
              size,
              cellStyle,
            },
          )
        })}
      </Pressable>
      {expandable && expandContent && (
        <Animated.View
          style={[
            styles.expandedContent,
            {
              height: expandAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolate: 'clamp',
              }),
              overflow: 'hidden',
            },
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              padding: spacing[3],
              backgroundColor: colors.surface,
              borderBottomWidth: variant === 'outlined' || variant === 'grid' ? 1 : 0,
              borderBottomColor: colors.border,
            }}
          >
            <View style={{ width: 32 }} />
            <View style={{ flex: 1 }}>{expandContent}</View>
          </View>
        </Animated.View>
      )}
    </View>
  )
}

const SIZE_STYLES: Record<NonNullable<ReturnType<typeof useTableCtx>['size']>, { cellPadding: number; fontSize: keyof typeof body }> = {
  sm: { cellPadding: spacing[1], fontSize: 'sm' },
  md: { cellPadding: spacing[2], fontSize: 'md' },
  lg: { cellPadding: spacing[3], fontSize: 'lg' },
}

const styles = StyleSheet.create({
  expandIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedContent: {
    flexDirection: 'row',
  },
})