import { act, renderHook } from '@testing-library/react'
import { useControllableState } from './useControllableState'
describe('useControllableState', () => {
  it('is uncontrolled with defaultValue', () => {
    const { result } = renderHook(() => useControllableState(undefined, 'a'))
    expect(result.current[0]).toBe('a')
    act(() => result.current[1]('b'))
    expect(result.current[0]).toBe('b')
  })
  it('is controlled when value provided', () => {
    const { result } = renderHook(() => useControllableState('x', 'a'))
    act(() => result.current[1]('y'))
    expect(result.current[0]).toBe('x')
  })
  it('fires onChange only for controlled', () => {
    const on = vi.fn()
    const { result } = renderHook(() => useControllableState<string>('x', undefined, on))
    act(() => result.current[1]('y'))
    expect(on).toHaveBeenCalledWith('y')
  })
})
