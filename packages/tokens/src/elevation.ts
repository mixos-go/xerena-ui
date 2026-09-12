import tokens from './tokens.json'

export type ElevationLevel = keyof typeof tokens.elevation

export const elevation = tokens.elevation as Record<ElevationLevel, string>
