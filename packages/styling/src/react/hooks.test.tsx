import { describe, expect, it, vi, beforeEach } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useReducedMotion } from './useReducedMotion'
import { useMotion } from './useMotion'

function installMatchMedia(initialMatches: boolean) {
  const listeners = new Set<() => void>()
  const mocks = new Map<string, ReturnType<typeof window.matchMedia>>()
  const setMatches = (matches: boolean) => {
    for (const mock of mocks.values()) {
      ;(mock as { matches: boolean }).matches = matches
    }
    listeners.forEach((cb) => cb())
  }
  window.matchMedia = vi.fn((query: string) => {
    const mock = {
      matches: initialMatches,
      media: query,
      onchange: null,
      addEventListener: (_: string, cb: () => void) => listeners.add(cb),
      removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
    } as unknown as MediaQueryList
    mocks.set(query, mock)
    return mock
  }) as unknown as typeof window.matchMedia
  return { setMatches }
}

describe('useReducedMotion', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.matchMedia = undefined as unknown as typeof window.matchMedia
  })

  it('is false when there is no matchMedia (SSR-safe)', () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it('tracks prefers-reduced-motion system changes', () => {
    const { setMatches } = installMatchMedia(false)
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
    act(() => setMatches(true))
    expect(result.current).toBe(true)
    act(() => setMatches(false))
    expect(result.current).toBe(false)
  })
})

describe('useMotion', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.matchMedia = undefined as unknown as typeof window.matchMedia
  })

  it('snaps every duration to instant when reduced', () => {
    const { result } = renderHook(() => useMotion({ reducedMotion: true }))
    expect(result.current.durations.base).toBe('1ms')
    expect(result.current.durations.emphatic).toBe('1ms')
    expect(result.current.durations.moderate).toBe('1ms')
  })

  it('returns css-ready durations when not reduced', () => {
    const { result } = renderHook(() => useMotion({ reducedMotion: false }))
    expect(result.current.durations.base).toBe('150ms')
    expect(result.current.durations.emphatic).toBe('600ms')
    expect(result.current.reduced).toBe(false)
  })

  it('builds cubic-bezier easings untouched by reduced motion', () => {
    const { result } = renderHook(() => useMotion({ reducedMotion: true }))
    expect(result.current.easings.standard).toBe('cubic-bezier(0.2, 0, 0, 1)')
    expect(result.current.easings.emphasis).toBe('cubic-bezier(0.34, 1.3, 0.64, 1)')
  })

  it('reports resolved reduced state', () => {
    const { result } = renderHook(() => useMotion({ reducedMotion: true }))
    expect(result.current.reduced).toBe(true)
  })

  it('reads system preference when no override is given', async () => {
    const { setMatches } = installMatchMedia(false)
    const { result } = renderHook(() => useMotion())
    await waitFor(() => expect(result.current.reduced).toBe(false))
    act(() => setMatches(true))
    await waitFor(() => expect(result.current.reduced).toBe(true))
    await waitFor(() => expect(result.current.durations.base).toBe('1ms'))
  })
})