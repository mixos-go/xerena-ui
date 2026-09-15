import { StyleSheet } from 'react-native'
import { fireEvent, render, screen } from '@testing-library/react-native'
import { Provider } from '../../primitives/Provider'
import { Message } from './Message'

describe('Message', () => {
  it('renders with role=alert and danger tone', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Message tone="danger" title="Error" description="Invalid input" />
      </Provider>,
    )
    const message = screen.getByRole('alert')
    expect(message).toBeDefined()
    expect(screen.getByText('Error')).toBeDefined()
    expect(screen.getByText('Invalid input')).toBeDefined()
  })

  it('calls onDismiss when close pressed', () => {
    const onDismiss = jest.fn()
    render(
      <Provider theme={{ mode: 'light' }}>
        <Message tone="info" title="OK" dismissible onDismiss={onDismiss}>
          Info
        </Message>
      </Provider>,
    )
    fireEvent.press(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('positions at top-left', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Message tone="neutral" position="top-left" title="Hi" />
      </Provider>,
    )
    const message = screen.getByRole('alert')
    const style = StyleSheet.flatten(message.props.style)
    expect(style.top).toBe(16)
    expect(style.left).toBe(16)
  })

  it('positions at bottom-center', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Message tone="neutral" position="bottom-center" title="Hi" />
      </Provider>,
    )
    const message = screen.getByRole('alert')
    const style = StyleSheet.flatten(message.props.style)
    expect(style.bottom).toBe(16)
    expect(style.left).toBe(0)
    expect(style.right).toBe(0)
  })

  it('uses semantic background and border colors', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Message tone="neutral" title="Hi" />
      </Provider>,
    )
    const message = screen.getByRole('alert')
    const style = StyleSheet.flatten(message.props.style)
    expect(style.backgroundColor).toBe('#faf7f2')
    expect(style.borderColor).toBe('#f4efe6')
  })

  it('uses dark semantic palette in dark mode', () => {
    render(
      <Provider theme={{ mode: 'dark' }}>
        <Message tone="neutral" title="Hi" />
      </Provider>,
    )
    const message = screen.getByRole('alert')
    const style = StyleSheet.flatten(message.props.style)
    expect(style.backgroundColor).toBe('#1b1712')
    expect(style.borderColor).toBe('#262019')
  })

  it('respects semantic overrides', () => {
    render(
      <Provider theme={{ mode: 'light', semantic: { background: '#ff0000', border: '#00ff00' } }}>
        <Message tone="neutral" title="Hi" />
      </Provider>,
    )
    const message = screen.getByRole('alert')
    const style = StyleSheet.flatten(message.props.style)
    expect(style.backgroundColor).toBe('#ff0000')
    expect(style.borderColor).toBe('#00ff00')
  })
})
