import { createContext, useContext, useState, useCallback, useRef, type ReactNode, Children, isValidElement, cloneElement } from 'react'
import { Animated, ScrollView, StyleSheet, Text, View, type ViewStyle, type TextStyle } from 'react-native'
import { Pressable } from '../../primitives/Pressable'
import { useNativeColors } from '../../hooks/useNativeColors'
import { useNativeMotion } from '../../hooks/useNativeMotion'
import { spacing } from '../../styles/spacing'
import { radius } from '../../styles/radius'
import { body } from '../../styles/typography'

type TabsVariant = 'underline' | 'pill' | 'enclosed'

interface TabsContextValue {
  value: string
  onChange: (value: string) => void
  variant: TabsVariant
}

const TabsContext = createContext<TabsContextValue>({
  value: '',
  onChange: () => {},
  variant: 'underline',
})

export const useTabsCtx = () => useContext(TabsContext)

export interface TabsRootProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  variant?: TabsVariant
  children: ReactNode
  testID?: string
}

export function TabsRoot({
  defaultValue = '',
  value: controlledValue,
  onValueChange,
  variant = 'underline',
  children,
  testID = 'tabs-root',
}: TabsRootProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : internalValue

  const handleChange = useCallback(
    (value: string) => {
      if (!isControlled) setInternalValue(value)
      onValueChange?.(value)
    },
    [isControlled, onValueChange],
  )

  return (
    <TabsContext.Provider value={{ value: currentValue, onChange: handleChange, variant }}>
      <View testID={testID}>{children}</View>
    </TabsContext.Provider>
  )
}

export interface TabsListProps {
  children: ReactNode
  style?: ViewStyle
  testID?: string
}

export function TabsList({ children, style, testID = 'tabs-list' }: TabsListProps) {
  const { variant, value } = useTabsCtx()
  const colors = useNativeColors()
  const { animate, reduced } = useNativeMotion()

  const indicatorRef = useRef(new Animated.Value(0)).current
  const indicatorWidthRef = useRef(new Animated.Value(0)).current
  const tabRefs = useRef<(React.ComponentRef<typeof Pressable> | null)[]>([])
  const measuredWidths = useRef<number[]>([])
  const measuredPositions = useRef<number[]>([])

  const updateIndicator = useCallback(
    (index: number) => {
      const left = measuredPositions.current[index] ?? 0
      const width = measuredWidths.current[index] ?? 0
      if (reduced) {
        indicatorRef.setValue(left)
        indicatorWidthRef.setValue(width)
      } else {
        Animated.timing(indicatorRef, animate({ toValue: left, duration: 'moderate', easing: 'standard' })).start()
        Animated.timing(indicatorWidthRef, animate({ toValue: width, duration: 'moderate', easing: 'standard' })).start()
      }
    },
    [animate, reduced, indicatorRef, indicatorWidthRef],
  )

  const measureTab = useCallback(
    (index: number, layout: { x: number; width: number }) => {
      measuredWidths.current[index] = layout.width
      measuredPositions.current[index] = layout.x
      const activeIndex = Children.toArray(children).findIndex(
        (child) => isValidElement(child) && (child.props as { value?: string }).value === value,
      )
      if (activeIndex === index) {
        updateIndicator(index)
      }
    },
    [children, updateIndicator, value],
  )

  const listStyle: ViewStyle = {
    flexDirection: 'row',
    gap: variant === 'pill' ? spacing[1] : 0,
    borderBottomWidth: variant === 'underline' ? 1 : 0,
    borderBottomColor: colors.border,
    ...style,
  }

  return (
    <ScrollView
      testID={`${testID}-scroll`}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <View testID={testID} style={listStyle} accessibilityRole="tablist">
        {Children.map(children, (child, index) => {
          if (!isValidElement(child)) return child
          if ((child.type as { displayName?: string }).displayName !== 'TabsTrigger') return child
          const props = child.props as { value: string; disabled?: boolean }
          const isSelected = props.value === value
          return cloneElement(child as React.ReactElement<TabsTriggerProps>, {
            isSelected,
            measureTab: (layout: { x: number; width: number }) => measureTab(index, layout),
            ref: (el: React.ComponentRef<typeof Pressable>) => {
              tabRefs.current[index] = el
            },
          })
        })}
        {variant === 'underline' && (
          <Animated.View
            style={[
              styles.indicator,
              {
                transform: [{ translateX: indicatorRef }],
                width: indicatorWidthRef,
                backgroundColor: colors.primary,
              },
            ]}
          />
        )}
      </View>
    </ScrollView>
  )
}

export interface TabsTriggerProps {
  value: string
  children: ReactNode
  disabled?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  testID?: string
  isSelected?: boolean
  measureTab?: (layout: { x: number; width: number }) => void
  ref?: React.Ref<React.ComponentRef<typeof Pressable>>
}

export function TabsTrigger({
  value,
  children,
  disabled = false,
  style,
  textStyle,
  testID = `tab-${value}`,
  isSelected = false,
  measureTab,
  ref,
}: TabsTriggerProps) {
  const { variant, onChange } = useTabsCtx()
  const colors = useNativeColors()

  const triggerStyle: ViewStyle = {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: variant === 'pill' || variant === 'enclosed' ? radius.md : 0,
    backgroundColor:
      variant === 'pill' || variant === 'enclosed'
        ? isSelected
          ? colors.primary
          : 'transparent'
        : 'transparent',
    borderWidth: variant === 'enclosed' ? 1 : 0,
    borderColor: variant === 'enclosed' ? (isSelected ? colors.primary : colors.border) : undefined,
    minWidth: 72,
    alignItems: 'center',
    ...style,
  }

  const textStyleFinal: TextStyle = {
    ...body.md,
    fontWeight: isSelected ? '600' : '400',
    color:
      variant === 'pill' || variant === 'enclosed'
        ? isSelected
          ? colors.textOnStrong
          : colors.text
        : isSelected
        ? colors.primary
        : colors.textMuted,
    ...textStyle,
  }

  const handlePress = () => {
    if (!disabled) onChange(value)
  }

  return (
    <Pressable
      ref={ref}
      testID={testID}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="tab"
      accessibilityState={{ selected: isSelected, disabled }}
      style={triggerStyle}
      onLayout={(e) => measureTab?.(e.nativeEvent.layout)}
    >
      <Text style={textStyleFinal}>{children}</Text>
    </Pressable>
  )
}

TabsTrigger.displayName = 'TabsTrigger'

export interface TabsPanelProps {
  value: string
  children: ReactNode
  style?: ViewStyle
  testID?: string
}

export function TabsPanel({ value, children, style, testID = `panel-${value}` }: TabsPanelProps) {
  const { value: currentValue } = useTabsCtx()
  if (currentValue !== value) return null
  return <View testID={testID} style={style} role="tabpanel" accessibilityLabel={`Panel ${value}`}>{children}</View>
}

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Panel: TabsPanel,
}

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    borderRadius: 1,
  },
})