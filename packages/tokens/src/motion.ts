import tokens from './tokens.json'

export type MotionDurationKey = keyof typeof tokens.motion.duration
export type MotionEasingKey = keyof typeof tokens.motion.easing

export const motion = tokens.motion