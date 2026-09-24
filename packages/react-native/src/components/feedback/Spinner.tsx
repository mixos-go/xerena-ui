import { useEffect, useRef } from 'react'
import { Animated, StyleSheet } from 'react-native'
import { useNativeColors } from '../../hooks/useNativeColors'
import { useNativeMotion } from '../../hooks/useNativeMotion'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const SIZE_MAP: Record<NonNullable<SpinnerProps['size']>, number> = {
  sm: 16,
  md: 24,
  lg: 32,
}

export function Spinner({ size = 'md', label = 'Loading…' }: SpinnerProps) {
  const colors = useNativeColors()
  const { reduced, animate } = useNativeMotion()
  const spin = useRef(new Animated.Value(0)).current
  const dimension = SIZE_MAP[size]

  useEffect(() => {
    if (reduced) return
    const animation = Animated.loop(
      Animated.timing(spin, animate({ toValue: 1, duration: 'long', easing: 'standard' })),
    )
    animation.start()
    return () => {
      animation.stop()
    }
  }, [reduced, spin, animate])

  const rotation = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <Animated.View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      style={[
        styles.ring,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          borderColor: colors.primary,
          borderTopColor: 'transparent',
          transform: [{ rotate: reduced ? '0deg' : rotation }],
        },
      ]}
    />
  )
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 2,
  },
})
