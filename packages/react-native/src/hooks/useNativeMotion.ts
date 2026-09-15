import { Easing, type EasingFunction } from 'react-native'
import { motion } from '@xerena/tokens'
import { useReducedMotion } from './useReducedMotion'

function isJestRuntime(): boolean {
  try {
    const g = globalThis as { process?: { env?: { JEST_WORKER_ID?: string } } }
    return g.process?.env?.JEST_WORKER_ID !== undefined
  } catch {
    return false
  }
}

export type MotionDurationKey = keyof typeof motion.duration
export type MotionEasingKey = keyof typeof motion.easing

export interface AnimateConfig {
  toValue: number
  duration: MotionDurationKey
  easing: MotionEasingKey
}

export interface AnimateOptions {
  toValue: number
  duration: number
  easing: EasingFunction
  useNativeDriver: boolean
}

export function useNativeMotion() {
  const reduced = useReducedMotion()
  const durations = motion.duration

  return {
    durations,
    reduced,
    easing: (key: MotionEasingKey): EasingFunction =>
      Easing.bezier(...(motion.easing[key] as [number, number, number, number])),
    animate: (config: AnimateConfig): AnimateOptions => {
      const duration = reduced ? motion.duration.instant : motion.duration[config.duration]
      const easing = Easing.bezier(...(motion.easing[config.easing] as [number, number, number, number]))
      return {
        toValue: config.toValue,
        duration,
        easing,
        useNativeDriver: !isJestRuntime(),
      }
    },
  }
}
