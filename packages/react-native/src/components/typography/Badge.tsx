import type { ReactNode } from 'react'
import { Text, View, type ViewStyle } from 'react-native'
import { semantic } from '@xerena/tokens'
import { useNativeColors } from '../../hooks/useNativeColors'
import { radius } from '../../styles/radius'
import { body } from '../../styles/typography'

export interface BadgeProps {
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'brand'
  size?: 'sm' | 'md'
  className?: string
  children: ReactNode
  testID?: string
}

export function Badge({ tone = 'neutral', size = 'md', children, testID }: BadgeProps) {
  const colors = useNativeColors()

  const palette: Record<NonNullable<BadgeProps['tone']>, { backgroundColor: string; color: string }> = {
    neutral: { backgroundColor: colors.surface, color: colors.textMuted },
    brand: { backgroundColor: colors.primary, color: colors.textOnStrong },
    info: { backgroundColor: colors.infoSurface, color: colors.infoText },
    success: { backgroundColor: colors.successSurface, color: colors.successText },
    warning: { backgroundColor: colors.warningSurface, color: colors.warningText },
    danger: { backgroundColor: colors.dangerSurface, color: colors.dangerText },
  }

  const style: ViewStyle = {
    backgroundColor: palette[tone].backgroundColor,
    borderRadius: radius.md,
    paddingHorizontal: size === 'sm' ? semantic.spacing.sm : semantic.spacing.md,
    paddingVertical: size === 'sm' ? semantic.spacing.xs : semantic.spacing.sm,
    alignSelf: 'flex-start',
  }

  return (
    <View testID={testID} style={style}>
      <Text style={{ ...body[size === 'sm' ? 'sm' : 'md'], color: palette[tone].color }}>{children}</Text>
    </View>
  )
}
