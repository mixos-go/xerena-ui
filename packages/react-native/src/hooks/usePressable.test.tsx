import { act, renderHook } from '@testing-library/react-native'
import { usePressable } from './usePressable'

const pressEvent = { nativeEvent: {} } as unknown as import('react-native').GestureResponderEvent
const hoverEvent = { nativeEvent: {} } as unknown as import('react-native').MouseEvent
const focusEvent = { nativeEvent: {} } as unknown as import('react-native').NativeSyntheticEvent<import('react-native').TargetedEvent>

describe('usePressable', () => {
  it('tracks pressed state', () => {
    const { result } = renderHook(() => usePressable())
    expect(result.current.pressed).toBe(false)

    act(() => {
      result.current.handlers.onPressIn?.(pressEvent)
    })
    expect(result.current.pressed).toBe(true)

    act(() => {
      result.current.handlers.onPressOut?.(pressEvent)
    })
    expect(result.current.pressed).toBe(false)
  })

  it('tracks hovered state', () => {
    const { result } = renderHook(() => usePressable())
    act(() => {
      result.current.handlers.onHoverIn?.(hoverEvent)
    })
    expect(result.current.hovered).toBe(true)

    act(() => {
      result.current.handlers.onHoverOut?.(hoverEvent)
    })
    expect(result.current.hovered).toBe(false)
  })

  it('tracks focused state', () => {
    const { result } = renderHook(() => usePressable())
    act(() => {
      result.current.handlers.onFocus?.(focusEvent)
    })
    expect(result.current.focused).toBe(true)

    act(() => {
      result.current.handlers.onBlur?.(focusEvent)
    })
    expect(result.current.focused).toBe(false)
  })

  it('does not set pressed when disabled', () => {
    const { result } = renderHook(() => usePressable({ disabled: true }))
    act(() => {
      result.current.handlers.onPressIn?.(pressEvent)
    })
    expect(result.current.pressed).toBe(false)
  })

  it('does not set pressed when loading', () => {
    const { result } = renderHook(() => usePressable({ loading: true }))
    act(() => {
      result.current.handlers.onPressIn?.(pressEvent)
    })
    expect(result.current.pressed).toBe(false)
  })

  it('invokes callbacks', () => {
    const callbacks = {
      onPressIn: jest.fn(),
      onPressOut: jest.fn(),
      onHoverIn: jest.fn(),
      onHoverOut: jest.fn(),
      onFocus: jest.fn(),
      onBlur: jest.fn(),
    }
    const { result } = renderHook(() => usePressable(callbacks))
    act(() => {
      result.current.handlers.onPressIn?.(pressEvent)
      result.current.handlers.onPressOut?.(pressEvent)
      result.current.handlers.onHoverIn?.(hoverEvent)
      result.current.handlers.onHoverOut?.(hoverEvent)
      result.current.handlers.onFocus?.(focusEvent)
      result.current.handlers.onBlur?.(focusEvent)
    })
    Object.values(callbacks).forEach((cb) => expect(cb).toHaveBeenCalledTimes(1))
  })
})
