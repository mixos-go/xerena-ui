import type { ReactNode } from 'react'
import { Pressable as RNPressable, type PressableProps as RNPressableProps } from 'react-native'
import { usePressable } from '../hooks/usePressable'
import type { PressableState } from '../hooks/usePressable'

export interface PressableProps extends Omit<RNPressableProps, 'children'> {
  loading?: boolean
  children?: ReactNode | ((state: PressableState) => ReactNode)
}

export function Pressable({
  disabled,
  loading,
  onPress,
  onPressIn,
  onPressOut,
  onHoverIn,
  onHoverOut,
  onFocus,
  onBlur,
  children,
  ...rest
}: PressableProps) {
  const { pressed, hovered, focused, handlers } = usePressable({
    disabled,
    loading,
    onPressIn,
    onPressOut,
    onHoverIn,
    onHoverOut,
    onFocus,
    onBlur,
  })

  const isDisabled = !!(disabled || loading)

  return (
    <RNPressable
      disabled={isDisabled}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      {...rest}
      onPress={isDisabled ? undefined : onPress}
      {...handlers}
    >
      {typeof children === 'function' ? children({ pressed, hovered, focused }) : children}
    </RNPressable>
  )
}

export type { PressableState }