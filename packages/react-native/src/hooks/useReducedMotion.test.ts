import { AccessibilityInfo } from 'react-native'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import { useReducedMotion } from './useReducedMotion'

describe('useReducedMotion', () => {
  beforeEach(() => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false)
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({ remove: jest.fn() } as never)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns false when AccessibilityInfo reports reduced motion is disabled', async () => {
    const { result } = renderHook(() => useReducedMotion())
    await waitFor(() => expect(result.current).toBe(false))
  })

  it('returns true when AccessibilityInfo reports reduced motion is enabled', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true)
    const { result } = renderHook(() => useReducedMotion())
    await waitFor(() => expect(result.current).toBe(true))
  })

  it('updates when reduceMotionChanged event fires', async () => {
    let listener: ((enabled: boolean) => void) | null = null
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation((_event, cb) => {
      listener = cb as unknown as (enabled: boolean) => void
      return { remove: jest.fn() } as never
    })

    const { result } = renderHook(() => useReducedMotion())
    await waitFor(() => expect(result.current).toBe(false))

    act(() => {
      if (listener) listener(true)
    })

    expect(result.current).toBe(true)
  })
})
