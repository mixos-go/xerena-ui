import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { useNativeColors } from '../../hooks/useNativeColors'
import { useNativeMotion } from '../../hooks/useNativeMotion'
import { radius } from '../../styles/radius'

export interface ProgressProps {
  value?: number
  variant?: 'bar' | 'pageTop' | 'pageBottom' | 'circle'
  size?: number
  stroke?: number
  label?: string
}

export function Progress({
  value = 0,
  variant = 'bar',
  size = 80,
  stroke = 8,
  label,
}: ProgressProps) {
  const colors = useNativeColors()
  const { reduced, animate } = useNativeMotion()
  const clamp = Math.max(0, Math.min(100, value))
  const progress = clamp / 100

  const animated = useRef(new Animated.Value(progress)).current
  const circleOpacity = useRef(new Animated.Value(reduced ? 1 : 0)).current

  useEffect(() => {
    if (reduced) {
      animated.setValue(progress)
      circleOpacity.setValue(1)
      return
    }
    const fillAnimation = Animated.timing(
      animated,
      animate({ toValue: progress, duration: 'base', easing: 'standard' }),
    )
    fillAnimation.start()
    return () => {
      fillAnimation.stop()
    }
  }, [progress, reduced, animated, animate])

  useEffect(() => {
    if (reduced || variant !== 'circle') return
    const fade = Animated.timing(
      circleOpacity,
      animate({ toValue: 1, duration: 'moderate', easing: 'enter' }),
    )
    fade.start()
    return () => {
      fade.stop()
    }
  }, [variant, reduced, circleOpacity, animate])

  if (variant === 'circle') {
    return (
      <View
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={label}
        accessibilityValue={{ min: 0, max: 100, now: clamp }}
        style={[
          styles.circleHost,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: stroke,
            borderColor: colors.border,
            opacity: circleOpacity,
          },
        ]}
      >
        <Animated.View
          testID="progress-circle-ring"
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderRadius: size / 2,
              borderWidth: stroke,
              borderColor: colors.primary,
              borderTopColor: 'transparent',
              transform: [{ rotate: `${clamp * 3.6}deg` }],
            },
          ]}
        />
      </View>
    )
  }

  const isFixed = variant === 'pageTop' || variant === 'pageBottom'
  const fixedSide = variant === 'pageBottom' ? { bottom: 0 } : { top: 0 }

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: clamp }}
      style={[
        styles.host,
        isFixed
          ? { position: 'absolute', left: 0, right: 0, height: 3, zIndex: 40, ...fixedSide }
          : { width: '100%', height: 8, borderRadius: radius.full },
        { backgroundColor: colors.border, overflow: 'hidden' },
      ]}
    >
      <Animated.View
        testID="progress-fill"
        style={[
          styles.fill,
          {
            backgroundColor: colors.primary,
            transform: [{ scaleX: reduced ? progress : animated }],
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  host: {
    flexDirection: 'row',
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
  },
  circleHost: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
