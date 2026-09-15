import { act, renderHook } from '@testing-library/react-native'
import { useControllableState } from './useControllableState'

describe('useControllableState', () => {
  it('uses internal state when uncontrolled', () => {
    const { result } = renderHook(() => useControllableState<number>(undefined, 0))
    expect(result.current[0]).toBe(0)

    act(() => {
      result.current[1](5)
    })
    expect(result.current[0]).toBe(5)
  })

  it('follows controlled value and calls onChange', () => {
    const onChange = jest.fn()
    const { result, rerender } = renderHook(
      (props: { value: number }) => useControllableState<number>(props.value, 0, onChange),
      { initialProps: { value: 1 } },
    )

    expect(result.current[0]).toBe(1)

    act(() => {
      result.current[1](10)
    })
    expect(onChange).toHaveBeenCalledWith(10)
    expect(result.current[0]).toBe(1)

    rerender({ value: 2 })
    expect(result.current[0]).toBe(2)
  })

  it('ignores internal updates when controlled', () => {
    const { result } = renderHook(() => useControllableState<string | undefined>('hello', undefined))
    act(() => {
      result.current[1]('world')
    })
    expect(result.current[0]).toBe('hello')
  })
})
