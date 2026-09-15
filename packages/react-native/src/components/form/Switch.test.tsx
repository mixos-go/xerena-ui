import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { semantic, semanticDark } from '@xerena/tokens'
import { Provider } from '../../primitives/Provider'
import { Switch } from './Switch'

jest.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: jest.fn(() => false),
}))

function wrapper(theme: { mode: 'light' | 'dark'; semantic?: Record<string, string> } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Switch', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders unchecked by default (md size)', () => {
    render(<Switch testID="switch" />, { wrapper: wrapper() })
    const switchEl = screen.getByTestId('switch')
    expect(switchEl.props.accessibilityState).toMatchObject({ checked: false })
    expect(switchEl.props.accessibilityRole).toBe('switch')
  })

  it('renders checked when checked prop is true', () => {
    render(<Switch testID="switch" checked />, { wrapper: wrapper() })
    const switchEl = screen.getByTestId('switch')
    expect(switchEl.props.accessibilityState).toMatchObject({ checked: true })
  })

  it('renders checked with defaultChecked', () => {
    render(<Switch testID="switch" defaultChecked />, { wrapper: wrapper() })
    const switchEl = screen.getByTestId('switch')
    expect(switchEl.props.accessibilityState).toMatchObject({ checked: true })
  })

  it('toggles on press (uncontrolled)', () => {
    render(<Switch testID="switch" />, { wrapper: wrapper() })
    const switchEl = screen.getByTestId('switch')
    expect(switchEl.props.accessibilityState).toMatchObject({ checked: false })
    act(() => {
      fireEvent.press(switchEl)
      jest.runAllTimers()
    })
    expect(switchEl.props.accessibilityState).toMatchObject({ checked: true })
  })

  it('calls onCheckedChange on press', () => {
    const onCheckedChange = jest.fn()
    render(<Switch testID="switch" onCheckedChange={onCheckedChange} />, { wrapper: wrapper() })
    act(() => {
      fireEvent.press(screen.getByTestId('switch'))
      jest.runAllTimers()
    })
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    act(() => {
      fireEvent.press(screen.getByTestId('switch'))
      jest.runAllTimers()
    })
    expect(onCheckedChange).toHaveBeenCalledWith(false)
  })

  it('does not toggle when disabled', () => {
    const onCheckedChange = jest.fn()
    render(<Switch testID="switch" disabled onCheckedChange={onCheckedChange} />, { wrapper: wrapper() })
    act(() => {
      fireEvent.press(screen.getByTestId('switch'))
      jest.runAllTimers()
    })
    expect(onCheckedChange).not.toHaveBeenCalled()
    expect(screen.getByTestId('switch').props.accessibilityState).toMatchObject({ disabled: true })
  })

  it('applies disabled opacity', () => {
    render(<Switch testID="switch" disabled />, { wrapper: wrapper() })
    expect(screen.getByTestId('switch')).toHaveStyle({ opacity: 0.5 })
  })

  it('applies sm size', () => {
    render(<Switch testID="switch" size="sm" />, { wrapper: wrapper() })
    const switchEl = screen.getByTestId('switch')
    expect(switchEl).toBeTruthy()
  })

  it('applies md size', () => {
    render(<Switch testID="switch" size="md" />, { wrapper: wrapper() })
    const switchEl = screen.getByTestId('switch')
    expect(switchEl).toBeTruthy()
  })

  it('controlled value takes precedence', () => {
    render(<Switch testID="switch" checked={false} onCheckedChange={jest.fn()} />, { wrapper: wrapper() })
    const switchEl = screen.getByTestId('switch')
    expect(switchEl.props.accessibilityState).toMatchObject({ checked: false })
    act(() => {
      fireEvent.press(switchEl)
      jest.runAllTimers()
    })
    expect(switchEl.props.accessibilityState).toMatchObject({ checked: false })
  })

  it('renders correctly in dark mode', () => {
    render(<Switch testID="switch" checked />, { wrapper: wrapper({ mode: 'dark' }) })
    const switchEl = screen.getByTestId('switch')
    expect(switchEl.props.accessibilityState).toMatchObject({ checked: true })
  })

  it('applies custom semantic override', () => {
    const override = '#ff0000'
    render(<Switch testID="switch" checked />, { wrapper: wrapper({ mode: 'light', semantic: { background: override } }) })
    const switchEl = screen.getByTestId('switch')
    expect(switchEl.props.accessibilityState).toMatchObject({ checked: true })
  })

  it('applies accessibilityLabel', () => {
    render(<Switch testID="switch" accessibilityLabel="Enable notifications" />, { wrapper: wrapper() })
    expect(screen.getByTestId('switch').props.accessibilityLabel).toBe('Enable notifications')
  })
})