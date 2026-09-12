import tokens from './tokens.json'

export type TypographyFamilyName = keyof typeof tokens.typography.fontFamily
export type DisplaySizeKey = keyof typeof tokens.typography.display
export type BodySizeKey = keyof typeof tokens.typography.body
export type MonoSizeKey = keyof typeof tokens.typography.mono

export const typography = tokens.typography
