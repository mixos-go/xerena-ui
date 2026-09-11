import { colors } from '../colors'
import { spacing } from '../spacing'

export const semantic = {
  color: {
    primary: colors.blue[600],
    primaryHover: colors.blue[700],
    background: colors.gray[50],
    surface: colors.gray[100],
    text: colors.gray[900],
    textMuted: colors.gray[500],
    border: colors.gray[100],
  },
  spacing: {
    xs: spacing[1],
    sm: spacing[2],
    md: spacing[4],
    lg: spacing[6],
    xl: spacing[8],
  },
} as const
