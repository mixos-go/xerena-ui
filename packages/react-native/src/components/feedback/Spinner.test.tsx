import { render, screen } from '@testing-library/react-native'
import { StyleSheet } from 'react-native'
import { Provider } from '../../primitives/Provider'
import { Spinner } from './Spinner'

jest.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: jest.fn(() => false),
}))

describe('Spinner', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders an accessible spinner with role=progressbar and label', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Spinner label="Loading…" />
      </Provider>,
    )
    const spinner = screen.getByRole('progressbar')
    expect(spinner.props.accessibilityLabel).toBe('Loading…')
  })

  it('applies md size by default', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Spinner />
      </Provider>,
    )
    const spinner = screen.getByRole('progressbar')
    const style = StyleSheet.flatten(spinner.props.style)
    expect(style).toEqual(expect.objectContaining({ width: 24, height: 24 }))
  })

  it('applies lg size', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Spinner size="lg" />
      </Provider>,
    )
    const spinner = screen.getByRole('progressbar')
    const style = StyleSheet.flatten(spinner.props.style)
    expect(style).toEqual(expect.objectContaining({ width: 32, height: 32 }))
  })

  it('uses primary color from the semantic palette', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Spinner />
      </Provider>,
    )
    const spinner = screen.getByRole('progressbar')
    const style = StyleSheet.flatten(spinner.props.style)
    expect(style).toEqual(expect.objectContaining({ borderColor: '#c04e1d' }))
  })

  it('is static under reduced motion', () => {
    jest.mock('../../hooks/useReducedMotion', () => ({
      useReducedMotion: jest.fn(() => true),
    }))
    render(
      <Provider theme={{ mode: 'light' }}>
        <Spinner />
      </Provider>,
    )
    const spinner = screen.getByRole('progressbar')
    const style = StyleSheet.flatten(spinner.props.style)
    expect(style).toEqual(expect.objectContaining({ transform: [{ rotate: '0deg' }] }))
  })
})
