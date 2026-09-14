import tokens from './tokens.json'

export type ColorShade = 50 | 100 | 500 | 600 | 700 | 900
export type ColorName = Exclude<keyof typeof tokens.color, 'dark'>

export const colors = tokens.color as Record<ColorName, Record<ColorShade, string>>
export const darkColors = tokens.color.dark as Record<'ember' | 'sand', Record<ColorShade, string>>
