import type { ReactNode } from 'react'
import { Text, type TextStyle } from 'react-native'
import { useNativeColors } from '../../hooks/useNativeColors'
import { body } from '../../styles/typography'

export interface LinkProps {
  variant?: 'default' | 'muted' | 'animated'
  href?: string
  target?: '_blank'
  rel?: string
  className?: string
  children: ReactNode
  accessibilityLabel?: string
  testID?: string
}

export function Link({ variant = 'default', href: _href, target: _target, rel: _rel, children, accessibilityLabel, testID, ...rest }: LinkProps) {
  void _href
  void _target
  void _rel

  const colors = useNativeColors()

  const colorMap: Record<NonNullable<LinkProps['variant']>, string> = {
    default: colors.primary,
    muted: colors.textMuted,
    animated: colors.primary,
  }

  const style: TextStyle = {
    ...body.md,
    color: colorMap[variant],
    borderBottomWidth: variant === 'animated' ? 1 : 0,
    borderBottomColor: variant === 'animated' ? colors.primary : undefined,
  }

  return (
    <Text
      testID={testID}
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel}
      style={style}
      {...rest}
    >
      {children}
    </Text>
  )
}
