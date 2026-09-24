import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { Pressable as RNPressable, type PressableProps as RNPressableProps, View, type PressableStateCallbackType } from 'react-native'
import { usePressable } from '../hooks/usePressable'
import type { PressableState } from '../hooks/usePressable'

export interface PressableProps extends Omit<RNPressableProps, 'children' | 'style'> {
  loading?: boolean
  children?: ReactNode | ((state: PressableState) => ReactNode)
  style?: RNPressableProps['style'] | ((state: PressableStateCallbackType) => RNPressableProps['style'])
}

const Pressable = forwardRef<View, PressableProps>(
  (
    {
      disabled,
      loading,
      onPress,
      onPressIn,
      onPressOut,
      onHoverIn,
      onHoverOut,
      onFocus,
      onBlur,
      accessibilityState,
      children,
      style,
      ...rest
    },
    ref,
  ) => {
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

    const resolvedStyle = typeof style === 'function'
      ? style({ pressed, hovered, focused } as PressableStateCallbackType)
      : style

    return (
      <RNPressable
        ref={ref}
        disabled={isDisabled}
        accessibilityState={{ disabled: !!disabled, busy: !!loading, ...accessibilityState }}
        {...rest}
        onPress={isDisabled ? undefined : onPress}
        {...handlers}
        style={resolvedStyle}
      >
        {typeof children === 'function' ? children({ pressed, hovered, focused }) : children}
      </RNPressable>
    )
  },
)

Pressable.displayName = 'Pressable'

export { Pressable }
export type { PressableState }