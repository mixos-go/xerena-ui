import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Animated, View, type ViewStyle } from 'react-native'
import { semantic } from '@xerena/tokens'
import { Pressable, type PressableState } from '../../primitives/Pressable'
import { useNativeColors } from '../../hooks/useNativeColors'
import { useNativeMotion } from '../../hooks/useNativeMotion'
import { nativeElevation } from '../../styles/elevation'
import { radius } from '../../styles/radius'

export interface CardProps {
  variant?: 'outlined' | 'elevated' | 'soft' | 'interactive' | 'flat'
  padding?: keyof typeof semantic.spacing
  className?: string
  children: ReactNode
  onPress?: () => void
  testID?: string
}

function AnimatedCard({
  pressed,
  children,
  baseStyle,
}: {
  pressed: boolean
  children: ReactNode
  baseStyle: ViewStyle
}) {
  const translateY = useRef(new Animated.Value(0)).current
  const { animate } = useNativeMotion()

  useEffect(() => {
    const target = pressed ? -1 : 0
    Animated.timing(translateY, animate({ toValue: target, duration: 'fast', easing: 'standard' })).start()
  }, [pressed, translateY, animate])

  return (
    <Animated.View
      style={[
        baseStyle,
        {
          transform: [{ translateY }],
          shadowColor: pressed ? nativeElevation('sm').shadowColor : nativeElevation('md').shadowColor,
          shadowOffset: pressed ? nativeElevation('sm').shadowOffset : nativeElevation('md').shadowOffset,
          shadowOpacity: pressed ? nativeElevation('sm').shadowOpacity : nativeElevation('md').shadowOpacity,
          shadowRadius: pressed ? nativeElevation('sm').shadowRadius : nativeElevation('md').shadowRadius,
          elevation: pressed ? nativeElevation('sm').elevation : nativeElevation('md').elevation,
        },
      ]}
    >
      {children}
    </Animated.View>
  )
}

export function Card({ variant = 'outlined', padding = 'md', children, onPress, testID }: CardProps) {
  const colors = useNativeColors()

  const baseStyle: ViewStyle = {
    backgroundColor:
      variant === 'soft' ? colors.surface : variant === 'flat' ? 'transparent' : colors.background,
    borderRadius: radius.md,
    padding: semantic.spacing[padding],
    borderWidth: variant === 'outlined' || variant === 'interactive' ? 1 : 0,
    borderColor: variant === 'outlined' || variant === 'interactive' ? colors.border : undefined,
    ...nativeElevation(variant === 'elevated' ? 'md' : variant === 'interactive' ? 'md' : 'none'),
  }

  if (variant === 'interactive') {
    return (
      <Pressable testID={testID} onPress={onPress} accessibilityRole="button" accessibilityState={{ disabled: false }}>
        {({ pressed }: PressableState) => <AnimatedCard pressed={pressed} baseStyle={baseStyle}>{children}</AnimatedCard>}
      </Pressable>
    )
  }

  return (
    <View testID={testID} style={baseStyle}>
      {children}
    </View>
  )
}
