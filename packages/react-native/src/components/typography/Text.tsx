import type { ReactNode } from 'react'
import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native'
import { useNativeColors } from '../../hooks/useNativeColors'
import { body, mono } from '../../styles/typography'

export interface TextProps extends Omit<RNTextProps, 'children'> {
  variant?: 'body' | 'muted' | 'strong' | 'error'
  size?: 'sm' | 'md' | 'lg'
  font?: 'body' | 'mono'
  truncate?: boolean
  center?: boolean
  as?: React.ElementType
  children: ReactNode
}

export function Text({
  variant = 'body',
  size = 'md',
  font = 'body',
  truncate,
  center,
  as: Comp = RNText,
  style,
  children,
  ...rest
}: TextProps) {
  const colors = useNativeColors()

  const colorMap: Record<NonNullable<TextProps['variant']>, string> = {
    body: colors.text,
    muted: colors.textMuted,
    strong: colors.text,
    error: colors.dangerText,
  }

  const textStyle: TextStyle = {
    ...(font === 'mono' ? mono[size] : body[size]),
    color: colorMap[variant],
    fontWeight: variant === 'strong' ? '700' : font === 'mono' ? mono[size].fontWeight : body[size].fontWeight,
    textAlign: center ? 'center' : undefined,
  }

  return (
    <Comp style={[textStyle, style]} numberOfLines={truncate ? 1 : undefined} {...rest}>
      {children}
    </Comp>
  )
}
