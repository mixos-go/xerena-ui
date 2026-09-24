import { useCallback, useState } from 'react'
import type {
  GestureResponderEvent,
  MouseEvent,
  NativeSyntheticEvent,
  TargetedEvent,
} from 'react-native'

export interface PressableState {
  pressed: boolean
  hovered: boolean
  focused: boolean
}

export interface UsePressableOptions {
  disabled?: boolean | null
  loading?: boolean | null
  onPressIn?: ((event: GestureResponderEvent) => void) | null
  onPressOut?: ((event: GestureResponderEvent) => void) | null
  onHoverIn?: ((event: MouseEvent) => void) | null
  onHoverOut?: ((event: MouseEvent) => void) | null
  onFocus?: ((event: NativeSyntheticEvent<TargetedEvent>) => void) | null
  onBlur?: ((event: NativeSyntheticEvent<TargetedEvent>) => void) | null
}

export interface UsePressableResult extends PressableState {
  handlers: {
    onPressIn?: (event: GestureResponderEvent) => void
    onPressOut?: (event: GestureResponderEvent) => void
    onHoverIn?: (event: MouseEvent) => void
    onHoverOut?: (event: MouseEvent) => void
    onFocus?: (event: NativeSyntheticEvent<TargetedEvent>) => void
    onBlur?: (event: NativeSyntheticEvent<TargetedEvent>) => void
  }
}

export function usePressable(options: UsePressableOptions = {}): UsePressableResult {
  const { disabled, loading, onPressIn, onPressOut, onHoverIn, onHoverOut, onFocus, onBlur } = options
  const [pressed, setPressed] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  const isDisabled = disabled || loading

  const handlePressIn = useCallback(
    (event: GestureResponderEvent) => {
      if (isDisabled) return
      setPressed(true)
      onPressIn?.(event)
    },
    [isDisabled, onPressIn],
  )

  const handlePressOut = useCallback(
    (event: GestureResponderEvent) => {
      setPressed(false)
      onPressOut?.(event)
    },
    [onPressOut],
  )

  const handleHoverIn = useCallback(
    (event: MouseEvent) => {
      setHovered(true)
      onHoverIn?.(event)
    },
    [onHoverIn],
  )

  const handleHoverOut = useCallback(
    (event: MouseEvent) => {
      setHovered(false)
      onHoverOut?.(event)
    },
    [onHoverOut],
  )

  const handleFocus = useCallback(
    (event: NativeSyntheticEvent<TargetedEvent>) => {
      setFocused(true)
      onFocus?.(event)
    },
    [onFocus],
  )

  const handleBlur = useCallback(
    (event: NativeSyntheticEvent<TargetedEvent>) => {
      setFocused(false)
      onBlur?.(event)
    },
    [onBlur],
  )

  return {
    pressed,
    hovered,
    focused,
    handlers: {
      onPressIn: handlePressIn,
      onPressOut: handlePressOut,
      onHoverIn: handleHoverIn,
      onHoverOut: handleHoverOut,
      onFocus: handleFocus,
      onBlur: handleBlur,
    },
  }
}
