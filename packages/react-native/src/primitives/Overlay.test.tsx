import { Modal, Text } from 'react-native'
import { act, render, screen } from '@testing-library/react-native'
import { Overlay } from './Overlay'

describe('Overlay', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders children when open', () => {
    render(
      <Overlay open onClose={jest.fn()}>
        <Text>overlay content</Text>
      </Overlay>,
    )
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.getByText('overlay content')).toBeDefined()
  })

  it('does not render children when closed', () => {
    render(
      <Overlay open={false} onClose={jest.fn()}>
        <Text>overlay content</Text>
      </Overlay>,
    )
    expect(screen.queryByText('overlay content')).toBeNull()
  })

  it('calls onClose through Modal onRequestClose', () => {
    const onClose = jest.fn()
    render(
      <Overlay open onClose={onClose}>
        <Text>overlay content</Text>
      </Overlay>,
    )
    const modal = screen.UNSAFE_getByType(Modal)
    act(() => {
      modal.props.onRequestClose()
    })
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
