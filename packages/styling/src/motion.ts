import { motion, type MotionDurationKey, type MotionEasingKey } from '@xerena/tokens'

export type { MotionDurationKey, MotionEasingKey } from '@xerena/tokens'

export type Bezier = readonly [number, number, number, number]

export function durationValue(key: MotionDurationKey): number {
  return motion.duration[key]
}

export function easingValue(key: MotionEasingKey): Bezier {
  return motion.easing[key] as unknown as Bezier
}
