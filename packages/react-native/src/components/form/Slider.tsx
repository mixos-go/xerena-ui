import { useCallback, useEffect, useRef, useState } from 'react'
import { PanResponder, View, Pressable, type ViewStyle } from 'react-native'
import { useNativeColors } from '../../hooks/useNativeColors'
import { useControllableState } from '../../hooks/useControllableState'
import { spacing } from '../../styles/spacing'
import { radius } from '../../styles/radius'

export interface SliderProps {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  orientation?: 'horizontal' | 'vertical'
  onValueChange?: (value: number) => void
  disabled?: boolean
  testID?: string
}

const THUMB_SIZE = 24
const TRACK_HEIGHT = 4

export function Slider({
  value: controlledValue,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  orientation = 'horizontal',
  onValueChange,
  disabled,
  testID,
}: SliderProps) {
  const colors = useNativeColors()
  const isDisabled = !!disabled

  const [internalValue, setInternalValue] = useControllableState(controlledValue, defaultValue)
  const currentValue = controlledValue ?? internalValue

  const [thumbPosition, setThumbPosition] = useState<number>(0)
  const [trackLayout, setTrackLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const trackRef = useRef<View>(null)
  const trackOrigin = useRef({ x: 0, y: 0 })

  const valueToPosition = useCallback(
    (val: number) => {
      if (!trackLayout) return 0
      const trackLength = orientation === 'horizontal' ? trackLayout.width : trackLayout.height
      const percentage = (val - min) / (max - min)
      return percentage * trackLength
    },
    [trackLayout, orientation, min, max],
  )

  const positionToValue = useCallback(
    (pos: number) => {
      if (!trackLayout) return min
      const trackLength = orientation === 'horizontal' ? trackLayout.width : trackLayout.height
      const percentage = Math.max(0, Math.min(1, pos / trackLength))
      let value = min + percentage * (max - min)
      // Snap to step
      value = Math.round(value / step) * step
      return Math.max(min, Math.min(max, value))
    },
    [trackLayout, orientation, min, max, step],
  )

  useEffect(() => {
    if (trackLayout) {
      setThumbPosition(valueToPosition(currentValue))
    }
  }, [currentValue, trackLayout, valueToPosition])

  const handleTrackLayout = useCallback(
    (event: { nativeEvent: { layout: { width: number; height: number } } }) => {
      const { width, height } = event.nativeEvent.layout
      setTrackLayout({ x: 0, y: 0, width, height })
      trackRef.current?.measureInWindow((x, y) => {
        trackOrigin.current = { x: x ?? 0, y: y ?? 0 }
      })
    },
    [],
  )

  const handleTrackPress = (event: { nativeEvent: { locationX: number; locationY: number } }) => {
    if (isDisabled || !trackLayout) return
    const pos = orientation === 'horizontal' ? event.nativeEvent.locationX : event.nativeEvent.locationY
    const newValue = positionToValue(pos)
    setInternalValue(newValue)
    onValueChange?.(newValue)
  }

  const positionToValueRef = useRef(positionToValue)
  positionToValueRef.current = positionToValue
  const disabledRef = useRef(isDisabled)
  disabledRef.current = isDisabled
  const orientationRef = useRef(orientation)
  orientationRef.current = orientation
  const changeRef = useRef({ setInternalValue, onValueChange })
  changeRef.current = { setInternalValue, onValueChange }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabledRef.current,
      onMoveShouldSetPanResponder: () => !disabledRef.current,
      onPanResponderMove: (_, gestureState) => {
        const origin = trackOrigin.current
        const horizontal = orientationRef.current === 'horizontal'
        const pos = horizontal ? gestureState.moveX - origin.x : gestureState.moveY - origin.y
        const newValue = positionToValueRef.current(pos)
        changeRef.current.setInternalValue(newValue)
        changeRef.current.onValueChange?.(newValue)
      },
      onPanResponderRelease: () => {},
    }),
  ).current

  const containerStyle: ViewStyle = {
    flex: 1,
    paddingHorizontal: THUMB_SIZE / 2,
    paddingVertical: spacing[3],
  }

  const trackStyle: ViewStyle = {
    flex: 1,
    height: TRACK_HEIGHT,
    borderRadius: radius.full,
    backgroundColor: isDisabled ? colors.border : colors.primary,
    ...(orientation === 'vertical' && { width: TRACK_HEIGHT, height: '100%' }),
  }

  const fillStyle: ViewStyle = {
    position: 'absolute',
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    ...(orientation === 'horizontal'
      ? { left: 0, top: 0, bottom: 0, width: thumbPosition }
      : { bottom: 0, left: 0, right: 0, height: thumbPosition }),
  }

  const thumbStyle: ViewStyle = {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: isDisabled ? colors.border : colors.primary,
    transform: orientation === 'horizontal'
      ? [{ translateX: thumbPosition - THUMB_SIZE / 2 }, { translateY: -THUMB_SIZE / 2 + TRACK_HEIGHT / 2 }]
      : [{ translateX: -THUMB_SIZE / 2 + TRACK_HEIGHT / 2 }, { translateY: thumbPosition - THUMB_SIZE / 2 }],
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    elevation: 3,
  }

  return (
    <View testID={testID} style={containerStyle} accessibilityRole="adjustable" accessibilityState={{ disabled: isDisabled }} accessibilityValue={{ min, max, now: currentValue }}>
      <Pressable
        ref={trackRef}
        testID={testID ? `${testID}-track` : undefined}
        onLayout={handleTrackLayout}
        onPress={handleTrackPress}
        disabled={isDisabled}
        style={trackStyle}
        {...panResponder.panHandlers}
        accessibilityRole="adjustable"
        accessibilityValue={{ min, max, now: currentValue }}
      >
        <View style={fillStyle} />
        <View
          testID={testID ? `${testID}-thumb` : undefined}
          style={thumbStyle}
        />
      </Pressable>
    </View>
  )
}