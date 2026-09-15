import { forwardRef, useRef, useEffect } from 'react'
import { Animated, View, type ViewStyle } from 'react-native'
import { Pressable } from '../../primitives/Pressable'
import { useNativeColors } from '../../hooks/useNativeColors'
import { useControllableState } from '../../hooks/useControllableState'
import { useNativeMotion } from '../../hooks/useNativeMotion'
import { spacing } from '../../styles/spacing'
import { radius } from '../../styles/radius'
import type { PressableStateCallbackType } from 'react-native'

export interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  size?: 'sm' | 'md'
  disabled?: boolean
  testID?: string
  accessibilityLabel?: string
}

const SIZE_MAP: Record<NonNullable<SwitchProps['size']>, { trackWidth: number; trackHeight: number; thumbSize: number }> = {
  sm: { trackWidth: 36, trackHeight: 20, thumbSize: 16 },
  md: { trackWidth: 44, trackHeight: 24, thumbSize: 20 },
}

export const Switch = forwardRef<View, SwitchProps>(
  function Switch(
    {
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      size = 'md',
      disabled,
      testID,
      accessibilityLabel,
    },
    ref,
  ) {
    const colors = useNativeColors()
    const { animate, reduced } = useNativeMotion()
    const isDisabled = !!disabled
    const s = SIZE_MAP[size]

    const [internalChecked, setInternalChecked] = useControllableState(controlledChecked, defaultChecked)
    const checked = controlledChecked ?? internalChecked

    const translateX = useRef(new Animated.Value(checked ? s.trackWidth - s.thumbSize - spacing[1] : spacing[1])).current
    const trackBg = useRef(new Animated.Value(0)).current

    const handlePress = () => {
      if (!isDisabled) {
        const next = !checked
        setInternalChecked(next)
        onCheckedChange?.(next)
      }
    }

    useEffect(() => {
      const targetX = checked ? s.trackWidth - s.thumbSize - spacing[1] : spacing[1]
      const targetBg = checked ? 1 : 0
      if (reduced) {
        translateX.setValue(targetX)
        trackBg.setValue(targetBg)
      } else {
        Animated.timing(translateX, animate({ toValue: targetX, duration: 'fast', easing: 'standard' })).start()
        Animated.timing(trackBg, animate({ toValue: targetBg, duration: 'fast', easing: 'standard' })).start()
      }
    }, [checked, reduced, s.trackWidth, s.thumbSize, animate])

    const trackStyle: ViewStyle = {
      width: s.trackWidth,
      height: s.trackHeight,
      borderRadius: radius.full,
      overflow: 'hidden',
    }

    const thumbStyle: ViewStyle = {
      position: 'absolute',
      width: s.thumbSize,
      height: s.thumbSize,
      borderRadius: radius.full,
      backgroundColor: colors.background,
      top: spacing[1],
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 2,
      shadowOpacity: 0.2,
      elevation: 2,
    }

    const trackBgColor = trackBg.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.border, colors.primary],
    })

    return (
      <Pressable
        ref={ref}
        testID={testID}
        onPress={handlePress}
        disabled={isDisabled}
        accessibilityRole="switch"
        accessibilityState={{
          checked,
          disabled: isDisabled,
        }}
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }: PressableStateCallbackType) => [
          { opacity: isDisabled ? 0.5 : 1 },
          pressed && !isDisabled ? { transform: [{ scale: 0.95 }] } : undefined,
        ]}
      >
        <Animated.View style={[{ ...trackStyle, backgroundColor: trackBgColor }]}>
          <Animated.View
            style={[
              thumbStyle,
              {
                transform: [
                  {
                    translateX,
                  },
                ],
              },
            ]}
          />
        </Animated.View>
      </Pressable>
    )
  },
)

Switch.displayName = 'Switch'