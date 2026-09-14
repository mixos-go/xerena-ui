import { renderHook } from '@testing-library/react'
import { useMediaQuery } from './useMediaQuery'
describe('useMediaQuery', () => {
  it('reads matchMedia with change listener', () => {
    const { result, unmount } = renderHook(() => useMediaQuery('(min-width: 600px)'))
    expect(result.current).toBe(false)
    ;(window.matchMedia as unknown as { listeners: Array<() => void> }).listeners?.forEach((l) => l())
    expect(result.current).toBe(false)
    unmount()
  })
})
