import { colors } from '../colors'
import { spacing } from '../spacing'

export const semantic = {
  color: {
    primary: colors.ember[600],
    primaryHover: colors.ember[700],
    background: colors.sand[50],
    surface: colors.sand[100],
    text: colors.sand[900],
    textMuted: colors.sand[500],
    border: colors.sand[100],
  },
  spacing: {
    xs: spacing[1],
    sm: spacing[2],
    md: spacing[4],
    lg: spacing[6],
    xl: spacing[8],
  },
} as const
