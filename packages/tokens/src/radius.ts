import tokens from './tokens.json'

export type RadiusKey = keyof typeof tokens.radius

export const radius = tokens.radius as Record<RadiusKey, number>
