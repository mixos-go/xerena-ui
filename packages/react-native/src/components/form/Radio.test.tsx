import { fireEvent, render, screen } from '@testing-library/react-native'
import { semantic, semanticDark } from '@xerena/tokens'
import { Provider } from '../../primitives/Provider'
import { Radio } from './Radio'

function wrapper(theme: { mode: 'light' | 'dark'; semantic?: Record<string, string> } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Radio', () => {
  it('renders unchecked by default', () => {
    render(<Radio testID="radio" value="a" />, { wrapper: wrapper() })
    const radio = screen.getByTestId('radio')
    expect(radio).toHaveStyle({ borderColor: semantic.color.border })
    expect(radio.props.accessibilityState).toMatchObject({ checked: false })
  })

  it('renders checked when checked prop is true', () => {
    render(<Radio testID="radio" value="a" checked />, { wrapper: wrapper() })
    const radio = screen.getByTestId('radio')
    expect(radio).toHaveStyle({ borderColor: semantic.color.primary })
    expect(radio.props.accessibilityState).toMatchObject({ checked: true })
  })

  it('calls onChange on press', () => {
    const onChange = jest.fn()
    render(<Radio testID="radio" value="a" onChange={onChange} />, { wrapper: wrapper() })
    fireEvent.press(screen.getByTestId('radio'))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('does not call onChange when disabled', () => {
    const onChange = jest.fn()
    render(<Radio testID="radio" value="a" disabled onChange={onChange} />, { wrapper: wrapper() })
    fireEvent.press(screen.getByTestId('radio'))
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByTestId('radio').props.accessibilityState).toMatchObject({ disabled: true, checked: false })
  })

  it('applies disabled opacity', () => {
    render(<Radio testID="radio" value="a" disabled />, { wrapper: wrapper() })
    expect(screen.getByTestId('radio')).toHaveStyle({ opacity: 0.5 })
  })

  it('passes value to accessibilityValue', () => {
    render(<Radio testID="radio" value="option-a" />, { wrapper: wrapper() })
    expect(screen.getByTestId('radio').props.accessibilityValue).toEqual({ text: 'option-a' })
  })

  it('renders correctly in dark mode', () => {
    render(<Radio testID="radio" value="a" checked />, { wrapper: wrapper({ mode: 'dark' }) })
    const radio = screen.getByTestId('radio')
    expect(radio).toHaveStyle({ borderColor: semanticDark.color.primary })
    expect(radio.props.accessibilityState).toMatchObject({ checked: true })
  })

  it('applies custom semantic override', () => {
    const override = '#ff0000'
    render(<Radio testID="radio" value="a" checked />, { wrapper: wrapper({ mode: 'light', semantic: { primary: override } }) })
    const radio = screen.getByTestId('radio')
    expect(radio).toHaveStyle({ borderColor: override })
    expect(radio.props.accessibilityState).toMatchObject({ checked: true })
  })

  it('applies accessibilityLabel', () => {
    render(<Radio testID="radio" value="a" accessibilityLabel="Option A" />, { wrapper: wrapper() })
    expect(screen.getByTestId('radio').props.accessibilityLabel).toBe('Option A')
  })

  it('renders accessibilityRole radio', () => {
    render(<Radio testID="radio" value="a" />, { wrapper: wrapper() })
    expect(screen.getByTestId('radio').props.accessibilityRole).toBe('radio')
  })
})