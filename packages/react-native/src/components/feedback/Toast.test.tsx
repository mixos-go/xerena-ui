import { StyleSheet } from 'react-native'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { Provider } from '../../primitives/Provider'
import { Toast, ToastProvider, toast } from './Toast'

jest.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: jest.fn(() => false),
}))

describe('Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders and calls onDismiss after autoHideDuration', async () => {
    const onDismiss = jest.fn()
    render(
      <Provider theme={{ mode: 'light' }}>
        <ToastProvider>
          <Toast title="Saved" autoHideDuration={100} onDismiss={onDismiss} />
        </ToastProvider>
      </Provider>,
    )
    expect(screen.getByText('Saved')).toBeDefined()
    act(() => {
      jest.advanceTimersByTime(200)
    })
    await waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1))
  })

  it('imperative toast dismiss preserves user onDismiss', async () => {
    const onDismiss = jest.fn()
    render(
      <Provider theme={{ mode: 'light' }}>
        <ToastProvider />
      </Provider>,
    )
    act(() => {
      toast({ title: 'Hi', dismissible: true, onDismiss, autoHideDuration: 0 })
      jest.runAllTimers()
    })
    const btn = screen.getByRole('button', { name: 'Dismiss' })
    fireEvent.press(btn)
    await waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1))
  })

  it('uses semantic background and border colors', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <ToastProvider>
          <Toast title="Hi" autoHideDuration={0} />
        </ToastProvider>
      </Provider>,
    )
    const toastEl = screen.getByTestId('toast-card')
    const style = StyleSheet.flatten(toastEl.props.style)
    expect(style.backgroundColor).toBe('#faf7f2')
    expect(style.borderColor).toBe('#f4efe6')
  })

  it('uses dark semantic palette in dark mode', () => {
    render(
      <Provider theme={{ mode: 'dark' }}>
        <ToastProvider>
          <Toast title="Hi" autoHideDuration={0} />
        </ToastProvider>
      </Provider>,
    )
    const toastEl = screen.getByTestId('toast-card')
    const style = StyleSheet.flatten(toastEl.props.style)
    expect(style.backgroundColor).toBe('#1b1712')
    expect(style.borderColor).toBe('#262019')
  })

  it('respects semantic overrides', () => {
    render(
      <Provider theme={{ mode: 'light', semantic: { background: '#ff0000', border: '#00ff00' } }}>
        <ToastProvider>
          <Toast title="Hi" autoHideDuration={0} />
        </ToastProvider>
      </Provider>,
    )
    const toastEl = screen.getByTestId('toast-card')
    const style = StyleSheet.flatten(toastEl.props.style)
    expect(style.backgroundColor).toBe('#ff0000')
    expect(style.borderColor).toBe('#00ff00')
  })

  it('snaps to final state under reduced motion', () => {
    jest.mock('../../hooks/useReducedMotion', () => ({
      useReducedMotion: jest.fn(() => true),
    }))

    render(
      <Provider theme={{ mode: 'light' }}>
        <ToastProvider>
          <Toast title="Hi" autoHideDuration={0} />
        </ToastProvider>
      </Provider>,
    )

    const toastEl = screen.getByTestId('toast-card')
    expect(toastEl).toBeDefined()

    jest.unmock('../../hooks/useReducedMotion')
  })
})
