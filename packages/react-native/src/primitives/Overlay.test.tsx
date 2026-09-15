import { Modal, Pressable, Text } from 'react-native'
import { act, render, screen } from '@testing-library/react-native'
import { Provider } from './Provider'
import { Overlay } from './Overlay'

jest.mock('../hooks/useReducedMotion', () => ({
  useReducedMotion: jest.fn(() => false),
}))

describe('Overlay', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders children when open', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Overlay open onClose={jest.fn()}>
          <Text>overlay content</Text>
        </Overlay>
      </Provider>,
    )
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.getByText('overlay content')).toBeDefined()
  })

  it('keeps Modal mounted during exit fade and unmounts after animation', () => {
    const { rerender } = render(
      <Provider theme={{ mode: 'light' }}>
        <Overlay open onClose={jest.fn()}>
          <Text>overlay content</Text>
        </Overlay>
      </Provider>,
    )
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.getByText('overlay content')).toBeDefined()

    rerender(
      <Provider theme={{ mode: 'light' }}>
        <Overlay open={false} onClose={jest.fn()}>
          <Text>overlay content</Text>
        </Overlay>
      </Provider>,
    )

    expect(screen.queryByText('overlay content')).not.toBeNull()
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.queryByText('overlay content')).toBeNull()
  })

  it('calls onClose through Modal onRequestClose', () => {
    const onClose = jest.fn()
    render(
      <Provider theme={{ mode: 'light' }}>
        <Overlay open onClose={onClose}>
          <Text>overlay content</Text>
        </Overlay>
      </Provider>,
    )
    const modal = screen.UNSAFE_getByType(Modal)
    act(() => {
      modal.props.onRequestClose()
    })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('resolves backdrop color from semantic text in light mode', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Overlay open onClose={jest.fn()}>
          <Text>overlay content</Text>
        </Overlay>
      </Provider>,
    )
    act(() => {
      jest.runAllTimers()
    })
    const modal = screen.UNSAFE_getByType(Modal)
    const backdrop = modal.findByType(Pressable)
    expect(backdrop.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: 'rgba(43, 38, 32, 0.4)' })]),
    )
  })

  it('resolves backdrop color from semanticDark text in dark mode', () => {
    render(
      <Provider theme={{ mode: 'dark' }}>
        <Overlay open onClose={jest.fn()}>
          <Text>overlay content</Text>
        </Overlay>
      </Provider>,
    )
    act(() => {
      jest.runAllTimers()
    })
    const modal = screen.UNSAFE_getByType(Modal)
    const backdrop = modal.findByType(Pressable)
    expect(backdrop.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: 'rgba(240, 236, 227, 0.4)' })]),
    )
  })

  it('respects semantic override for backdrop color', () => {
    render(
      <Provider theme={{ mode: 'light', semantic: { text: '#ff0000' } }}>
        <Overlay open onClose={jest.fn()}>
          <Text>overlay content</Text>
        </Overlay>
      </Provider>,
    )
    act(() => {
      jest.runAllTimers()
    })
    const modal = screen.UNSAFE_getByType(Modal)
    const backdrop = modal.findByType(Pressable)
    expect(backdrop.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: 'rgba(255, 0, 0, 0.4)' })]),
    )
  })
})
