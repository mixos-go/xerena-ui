import tokens from './tokens.json'

export type SpacingKey = keyof typeof tokens.spacing

export const spacing = tokens.spacing as Record<SpacingKey, number>
