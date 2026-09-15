import { motion } from '@xerena/tokens'
import { renderHook } from '@testing-library/react-native'
import { useNativeMotion } from './useNativeMotion'

jest.mock('./useReducedMotion', () => ({
  useReducedMotion: jest.fn(),
}))

import { useReducedMotion as mockedUseReducedMotion } from './useReducedMotion'

const mockedReduced = mockedUseReducedMotion as jest.Mock

describe('useNativeMotion', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockedReduced.mockReturnValue(false)
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  it('exposes token durations', () => {
    const { result } = renderHook(() => useNativeMotion())
    expect(result.current.durations).toEqual(motion.duration)
  })

  it('builds bezier easing from tokens', () => {
    const { result } = renderHook(() => useNativeMotion())
    expect(result.current.easing('enter')).toBeInstanceOf(Function)
  })

  it('honors requested duration and easing when reduced motion is off', () => {
    const { result } = renderHook(() => useNativeMotion())
    const options = result.current.animate({ toValue: 1, duration: 'moderate', easing: 'enter' })
    expect(options.toValue).toBe(1)
    expect(options.duration).toBe(motion.duration.moderate)
    expect(options.easing).toBeInstanceOf(Function)
    expect(typeof options.useNativeDriver).toBe('boolean')
  })

  it('snaps duration to instant when reduced motion is on', () => {
    mockedReduced.mockReturnValue(true)
    const { result } = renderHook(() => useNativeMotion())
    const options = result.current.animate({ toValue: 1, duration: 'long', easing: 'exit' })
    expect(options.duration).toBe(motion.duration.instant)
  })
})
