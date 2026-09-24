import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { Animated, Text, type ViewStyle } from 'react-native'
import { Pressable, type PressableState } from '../../primitives/Pressable'
import { useNativeColors } from '../../hooks/useNativeColors'
import { useNativeMotion } from '../../hooks/useNativeMotion'
import { semantic } from '@xerena/tokens'
import { radius } from '../../styles/radius'
import { body } from '../../styles/typography'

export interface ButtonProps {
  variant?: 'primary' | 'ghost' | 'outline' | 'soft' | 'destructive' | 'link'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  animated?: boolean
  fullWidth?: boolean
  disabled?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  className?: string
  children: ReactNode
  type?: 'button' | 'submit' | 'reset'
  value?: string
  selected?: boolean
  onPress?: () => void
  accessibilityLabel?: string
  accessibilityHint?: string
  testID?: string
}

const SIZE: Record<NonNullable<ButtonProps['size']>, { paddingHorizontal: number; height: number; text: keyof typeof body }> = {
  sm: { paddingHorizontal: semantic.spacing.sm, height: 32, text: 'sm' },
  md: { paddingHorizontal: semantic.spacing.md, height: 40, text: 'md' },
  lg: { paddingHorizontal: semantic.spacing.lg, height: 48, text: 'lg' },
}

function AnimatedContent({
  pressed,
  animated,
  style,
  children,
}: {
  pressed: boolean
  animated?: boolean
  style?: ViewStyle
  children: ReactNode
}) {
  const scale = useRef(new Animated.Value(1)).current
  const { animate } = useNativeMotion()

  useEffect(() => {
    if (!animated) return
    const target = pressed ? 0.96 : 1
    const options = animate({ toValue: target, duration: 'fast', easing: 'standard' })
    Animated.timing(scale, options).start()
  }, [animated, pressed, scale, animate])

  return (
    <Animated.View
      style={[
        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' },
        animated ? { transform: [{ scale }] } : undefined,
        style,
      ]}
    >
      {children}
    </Animated.View>
  )
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  animated,
  fullWidth,
  disabled,
  leftIcon,
  rightIcon,
  children,
  type: _type,
  value: _value,
  selected,
  onPress,
  testID,
  ...rest
}: ButtonProps) {
  void _type
  void _value

  const colors = useNativeColors()
  const s = SIZE[size]

  const backgroundMap: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: colors.primary,
    destructive: colors.danger,
    outline: 'transparent',
    ghost: 'transparent',
    soft: colors.surfaceHover,
    link: 'transparent',
  }

  const colorMap: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: colors.textOnStrong,
    destructive: colors.textOnStrong,
    outline: colors.primary,
    ghost: colors.primary,
    soft: colors.primary,
    link: colors.primary,
  }

  const containerStyle: ViewStyle = {
    backgroundColor: backgroundMap[variant],
    borderRadius: radius.md,
    paddingHorizontal: s.paddingHorizontal,
    height: s.height,
    width: fullWidth ? '100%' : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: variant === 'outline' ? 1 : 0,
    borderColor: variant === 'outline' ? colors.primary : undefined,
  }

  const textStyle = {
    ...body[s.text],
    color: colorMap[variant],
  }

  return (
    <Pressable
      testID={testID}
      disabled={disabled}
      loading={loading}
      onPress={onPress}
      accessibilityState={{ selected: !!selected }}
      style={containerStyle}
      {...rest}
    >
      {({ pressed }: PressableState) => (
        <AnimatedContent pressed={pressed} animated={animated}>
          {leftIcon}
          {typeof children === 'string' || typeof children === 'number' ? (
            <Text style={textStyle} numberOfLines={1}>
              {children}
            </Text>
          ) : (
            children
          )}
          {rightIcon}
        </AnimatedContent>
      )}
    </Pressable>
  )
}
