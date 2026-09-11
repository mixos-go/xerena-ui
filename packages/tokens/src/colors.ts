import tokens from './tokens.json'

export type ColorShade = 50 | 100 | 500 | 600 | 700
export type ColorName = keyof typeof tokens.color

export const colors = tokens.color as Record<ColorName, Record<ColorShade, string>>
