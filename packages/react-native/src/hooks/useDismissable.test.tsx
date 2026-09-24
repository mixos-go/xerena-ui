import { BackHandler } from 'react-native'
import { act, renderHook } from '@testing-library/react-native'
import { useDismissable } from './useDismissable'

describe('useDismissable', () => {
  beforeEach(() => {
    jest.spyOn(BackHandler, 'addEventListener').mockReturnValue({ remove: jest.fn() } as never)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns backdrop responder props', () => {
    const { result } = renderHook(() => useDismissable({ open: true, onDismiss: jest.fn() }))
    expect(result.current.backdropProps.onStartShouldSetResponder()).toBe(true)
    act(() => {
      result.current.backdropProps.onResponderRelease()
    })
    expect(result.current.onRequestClose).toBeInstanceOf(Function)
  })

  it('calls onDismiss on backdrop release', () => {
    const onDismiss = jest.fn()
    const { result } = renderHook(() => useDismissable({ open: true, onDismiss }))
    act(() => {
      result.current.backdropProps.onResponderRelease()
    })
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('calls onDismiss on Android back when open', () => {
    const onDismiss = jest.fn()
    let backHandler: (() => boolean) | null = null
    jest.spyOn(BackHandler, 'addEventListener').mockImplementation((_event, cb) => {
      backHandler = cb as () => boolean
      return { remove: jest.fn() } as never
    })

    renderHook(() => useDismissable({ open: true, onDismiss }))
    expect(BackHandler.addEventListener).toHaveBeenCalledWith('hardwareBackPress', expect.any(Function))

    act(() => {
      if (backHandler) backHandler()
    })
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('does not call onDismiss on back when closed', () => {
    const onDismiss = jest.fn()
    const { result } = renderHook(() => useDismissable({ open: false, onDismiss }))
    act(() => {
      result.current.onRequestClose()
    })
    expect(onDismiss).not.toHaveBeenCalled()
  })
})
