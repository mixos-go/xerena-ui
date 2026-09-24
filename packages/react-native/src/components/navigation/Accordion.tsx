import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react'
import { Animated, StyleSheet, Text, View, type ViewStyle, type TextStyle } from 'react-native'
import { Pressable } from '../../primitives/Pressable'
import { useNativeColors } from '../../hooks/useNativeColors'
import { useNativeMotion } from '../../hooks/useNativeMotion'
import { spacing } from '../../styles/spacing'
import { body, display } from '../../styles/typography'

interface AccordionContextValue {
  type: 'single' | 'multiple'
  expanded: Set<string>
  toggle: (value: string) => void
}

const AccordionContext = createContext<AccordionContextValue>({
  type: 'single',
  expanded: new Set(),
  toggle: () => {},
})

export const useAccordionCtx = () => useContext(AccordionContext)

export interface AccordionRootProps {
  type?: 'single' | 'multiple'
  defaultValue?: string[]
  value?: string[]
  onValueChange?: (value: string[]) => void
  children: ReactNode
  testID?: string
}

export function AccordionRoot({
  type = 'single',
  defaultValue = [],
  value: controlledValue,
  onValueChange,
  children,
  testID = 'accordion-root',
}: AccordionRootProps) {
  const [internalExpanded, setInternalExpanded] = useState(new Set(defaultValue))
  const isControlled = controlledValue !== undefined
  const currentExpanded = isControlled ? new Set(controlledValue) : internalExpanded

  const toggle = useCallback(
    (value: string) => {
      const computeNext = (prev: Set<string>) => {
        const newExpanded = new Set(prev)
        if (newExpanded.has(value)) {
          newExpanded.delete(value)
        } else if (type === 'single') {
          newExpanded.clear()
          newExpanded.add(value)
        } else {
          newExpanded.add(value)
        }
        return newExpanded
      }
      if (isControlled) {
        onValueChange?.(Array.from(computeNext(new Set(controlledValue))))
      } else {
        const next = computeNext(internalExpanded)
        setInternalExpanded(next)
        onValueChange?.(Array.from(next))
      }
    },
    [isControlled, controlledValue, internalExpanded, type, onValueChange],
  )

  return (
    <AccordionContext.Provider value={{ type, expanded: currentExpanded, toggle }}>
      <View testID={testID}>{children}</View>
    </AccordionContext.Provider>
  )
}

export interface AccordionItemProps {
  value: string
  children: ReactNode
  style?: ViewStyle
  testID?: string
}

export function AccordionItem({ value, children, style, testID = `item-${value}` }: AccordionItemProps) {
  const { expanded } = useAccordionCtx()
  const isOpen = expanded.has(value)

  return (
    <View testID={testID} style={[styles.item, { borderBottomColor: isOpen ? 'transparent' : undefined }, style]}>
      {children}
    </View>
  )
}

export interface AccordionHeaderProps {
  children: ReactNode
  style?: ViewStyle
  testID?: string
}

export function AccordionHeader({ children, style, testID = 'header' }: AccordionHeaderProps) {
  return <View testID={testID} style={[styles.header, style]}>{children}</View>
}

export interface AccordionTriggerProps {
  value: string
  children: ReactNode
  style?: ViewStyle
  textStyle?: TextStyle
  testID?: string
}

export function AccordionTrigger({
  value,
  children,
  style,
  textStyle,
  testID = `trigger-${value}`,
}: AccordionTriggerProps) {
  const { expanded, toggle } = useAccordionCtx()
  const { animate, reduced } = useNativeMotion()
  const colors = useNativeColors()
  const isOpen = expanded.has(value)

  const chevronAnim = useRef(new Animated.Value(isOpen ? 1 : 0)).current
  const wasOpen = useRef(isOpen)

  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      Animated.timing(chevronAnim, animate({ toValue: 1, duration: 'fast', easing: 'standard' })).start()
    } else if (!isOpen && wasOpen.current) {
      if (reduced) {
        chevronAnim.setValue(0)
      } else {
        Animated.timing(chevronAnim, animate({ toValue: 0, duration: 'emphatic', easing: 'exit' })).start()
      }
    }
    wasOpen.current = isOpen
  }, [isOpen, animate, reduced, chevronAnim])

  const triggerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: spacing[3],
    backgroundColor: 'transparent',
    ...style,
  }

  const textStyleFinal: TextStyle = {
    ...display.xs,
    fontWeight: '600',
    color: colors.text,
    ...textStyle,
  }

  return (
    <Pressable
      testID={testID}
      onPress={() => toggle(value)}
      accessibilityRole="button"
      accessibilityState={{ expanded: isOpen }}
      accessibilityHint={isOpen ? 'Collapses content' : 'Expands content'}
      style={triggerStyle}
    >
      <Text style={textStyleFinal}>{children}</Text>
      <Animated.View
        style={[
          styles.chevron,
          {
            transform: [{ rotate: chevronAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }],
          },
        ]}
      >
        <Text style={textStyleFinal}>▾</Text>
      </Animated.View>
    </Pressable>
  )
}

export interface AccordionContentProps {
  value: string
  children: ReactNode
  style?: ViewStyle
  testID?: string
}

export function AccordionContent({ value, children, style, testID = `content-${value}` }: AccordionContentProps) {
  const { expanded } = useAccordionCtx()
  const { animate, reduced } = useNativeMotion()
  const colors = useNativeColors()
  const isOpen = expanded.has(value)
  const [closing, setClosing] = useState(false)
  const visible = isOpen || closing

  const heightAnim = useRef(new Animated.Value(isOpen ? 1 : 0)).current
  const [contentHeight, setContentHeight] = useState(0)
  const wasOpen = useRef(isOpen)

  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      setClosing(false)
      if (reduced) {
        heightAnim.setValue(1)
      } else {
        Animated.timing(heightAnim, animate({ toValue: 1, duration: 'moderate', easing: 'standard' })).start()
      }
    } else if (!isOpen && wasOpen.current) {
      setClosing(true)
      if (reduced) {
        heightAnim.setValue(0)
        setClosing(false)
      } else {
        Animated.timing(heightAnim, animate({ toValue: 0, duration: 'emphatic', easing: 'exit' })).start(
          ({ finished }) => {
            if (finished) setClosing(false)
          },
        )
      }
    }
    wasOpen.current = isOpen
  }, [isOpen, animate, reduced, heightAnim])

  if (!visible) return null

  return (
    <Animated.View
      testID={testID}
      style={[
        styles.content,
        {
          overflow: 'hidden',
          maxHeight: contentHeight
            ? heightAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, contentHeight],
              extrapolate: 'clamp',
            })
            : undefined,
        },
        style,
      ]}
      role="region"
      nativeID={`acc-content-${value}`}
    >
      <View
        testID={`${testID}-inner`}
        onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
        style={styles.contentInner}
      >
        <Text style={[body.md, { color: colors.text }]}>{children}</Text>
      </View>
    </Animated.View>
  )
}

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
}

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
  },
  header: {},
  chevron: {
    paddingLeft: spacing[2],
  },
  content: {},
  contentInner: {
    paddingBottom: spacing[3],
  },
})