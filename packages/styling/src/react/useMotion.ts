import { useMemo } from 'react'
import { motion, type MotionDurationKey, type MotionEasingKey } from '@xerena/tokens'
import { useReducedMotion } from './useReducedMotion'

export interface UseMotionOptions {
  reducedMotion?: boolean
}

export interface UseMotionResult {
  durations: Record<MotionDurationKey, string>
  easings: Record<MotionEasingKey, string>
  reduced: boolean
}

export function useMotion(options: UseMotionOptions = {}): UseMotionResult {
  const systemReduced = useReducedMotion()
  const reduced = options.reducedMotion ?? systemReduced

  return useMemo<UseMotionResult>(() => {
    const durations = Object.fromEntries(
      Object.entries(motion.duration).map(([key, ms]) => [key, reduced ? '1ms' : `${ms}ms`]),
    ) as Record<MotionDurationKey, string>
    const easings = Object.fromEntries(
      Object.entries(motion.easing).map(([key, points]) => [key, `cubic-bezier(${points.join(', ')})`]),
    ) as Record<MotionEasingKey, string>
    return { durations, easings, reduced }
  }, [reduced])
}