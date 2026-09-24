import { useEffect, useRef } from 'react'
import { Animated, View, type DimensionValue, type ViewStyle } from 'react-native'
import { useNativeColors } from '../../hooks/useNativeColors'
import { useNativeMotion } from '../../hooks/useNativeMotion'
import { radius } from '../../styles/radius'

export interface SkeletonProps {
  shape?: 'line' | 'circle' | 'rect' | 'text'
  width?: number | string
  height?: number | string
  style?: ViewStyle
  className?: string
  testID?: string
}

export function Skeleton({ shape = 'line', width, height, style, testID }: SkeletonProps) {
  const colors = useNativeColors()
  const opacity = useRef(new Animated.Value(1)).current
  const { animate, reduced } = useNativeMotion()

  useEffect(() => {
    if (reduced) return
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, animate({ toValue: 0.4, duration: 'base', easing: 'standard' })),
        Animated.timing(opacity, animate({ toValue: 1, duration: 'base', easing: 'standard' })),
      ]),
    )
    loop.start()
    return () => {
      loop.stop()
    }
  }, [reduced, opacity, animate])

  const borderRadius = shape === 'circle' ? radius.full : shape === 'text' ? radius.sm : radius.md

  return (
    <View
      testID={testID}
      style={[
        {
          width: width as DimensionValue,
          height: height as DimensionValue,
          backgroundColor: colors.surface,
          borderRadius,
          overflow: 'hidden',
        },
        reduced ? { opacity: 0.4 } : { opacity },
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityState={{ busy: true }}
    />
  )
}
