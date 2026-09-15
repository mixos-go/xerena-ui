import { useMemo } from 'react'
import { Easing, type EasingFunction } from 'react-native'
import { motion } from '@xerena/tokens'
import { useReducedMotion } from './useReducedMotion'

declare const process: { env: { NODE_ENV?: string } }

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
  const easings = useMemo(() => motion.easing, [])

  return {
    durations,
    reduced,
    easing: (key: MotionEasingKey): EasingFunction =>
      Easing.bezier(...(easings[key] as [number, number, number, number])),
    animate: (config: AnimateConfig): AnimateOptions => {
      const duration = reduced ? motion.duration.instant : motion.duration[config.duration]
      const easing = Easing.bezier(...(easings[config.easing] as [number, number, number, number]))
      return {
        toValue: config.toValue,
        duration,
        easing,
        useNativeDriver: process.env.NODE_ENV !== 'test',
      }
    },
  }
}
