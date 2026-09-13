import { colors, darkColors, type ColorName, type ColorShade } from '../colors'
import { spacing } from '../spacing'
import alias from '../semantic.json'

export type SemanticAlias = keyof typeof alias.light
type AliasMap = Record<SemanticAlias, { name: ColorName; shade: ColorShade }>

function resolve(map: AliasMap, palettes: Record<ColorName, Record<ColorShade, string>>) {
  return Object.fromEntries(
    Object.entries(map).map(([k, v]) => [k, palettes[v.name as ColorName][v.shade as ColorShade]]),
  ) as Record<SemanticAlias, string>
}

export const semantic = {
  color: resolve(alias.light as AliasMap, colors),
  spacing: {
    xs: spacing[1],
    sm: spacing[2],
    md: spacing[4],
    lg: spacing[6],
    xl: spacing[8],
  },
} as const

export const semanticDark = {
  color: resolve(alias.dark as AliasMap, { ...colors, ...darkColors } as Record<ColorName, Record<ColorShade, string>>),
} as const