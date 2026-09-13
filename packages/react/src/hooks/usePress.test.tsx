import { act, renderHook } from '@testing-library/react'
import { usePress } from './usePress'
describe('usePress', () => {
  it('tracks active pointer state', () => {
    const { result } = renderHook(() => usePress())
    expect(result.current.pressed).toBe(false)
    act(() => result.current.onPointerDown())
    expect(result.current.pressed).toBe(true)
    act(() => result.current.onPointerUp())
    expect(result.current.pressed).toBe(false)
  })
})