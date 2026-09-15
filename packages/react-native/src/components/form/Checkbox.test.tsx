import { fireEvent, render, screen } from '@testing-library/react-native'
import { semantic, semanticDark } from '@xerena/tokens'
import { Provider } from '../../primitives/Provider'
import { Checkbox } from './Checkbox'

function wrapper(theme: { mode: 'light' | 'dark'; semantic?: Record<string, string> } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox testID="checkbox" />, { wrapper: wrapper() })
    const checkbox = screen.getByTestId('checkbox')
    expect(checkbox).toHaveStyle({ borderColor: semantic.color.border, backgroundColor: 'transparent' })
    expect(checkbox.props.accessibilityState).toMatchObject({ checked: false })
  })

  it('renders checked when checked prop is true', () => {
    render(<Checkbox testID="checkbox" checked />, { wrapper: wrapper() })
    const checkbox = screen.getByTestId('checkbox')
    expect(checkbox).toHaveStyle({ borderColor: semantic.color.primary, backgroundColor: semantic.color.primary })
    expect(checkbox.props.accessibilityState).toMatchObject({ checked: true })
  })

  it('renders checked with defaultChecked', () => {
    render(<Checkbox testID="checkbox" defaultChecked />, { wrapper: wrapper() })
    const checkbox = screen.getByTestId('checkbox')
    expect(checkbox.props.accessibilityState).toMatchObject({ checked: true })
  })

  it('toggles on press (uncontrolled)', () => {
    render(<Checkbox testID="checkbox" />, { wrapper: wrapper() })
    const checkbox = screen.getByTestId('checkbox')
    expect(checkbox.props.accessibilityState).toMatchObject({ checked: false })
    fireEvent.press(checkbox)
    expect(checkbox.props.accessibilityState).toMatchObject({ checked: true })
  })

  it('calls onCheckedChange on press', () => {
    const onCheckedChange = jest.fn()
    render(<Checkbox testID="checkbox" onCheckedChange={onCheckedChange} />, { wrapper: wrapper() })
    fireEvent.press(screen.getByTestId('checkbox'))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    fireEvent.press(screen.getByTestId('checkbox'))
    expect(onCheckedChange).toHaveBeenCalledWith(false)
  })

  it('does not toggle when disabled', () => {
    const onCheckedChange = jest.fn()
    render(<Checkbox testID="checkbox" disabled onCheckedChange={onCheckedChange} />, { wrapper: wrapper() })
    fireEvent.press(screen.getByTestId('checkbox'))
    expect(onCheckedChange).not.toHaveBeenCalled()
    expect(screen.getByTestId('checkbox').props.accessibilityState).toMatchObject({ disabled: true })
  })

  it('applies disabled opacity', () => {
    render(<Checkbox testID="checkbox" disabled />, { wrapper: wrapper() })
    expect(screen.getByTestId('checkbox')).toHaveStyle({ opacity: 0.5 })
  })

  it('renders indeterminate state', () => {
    render(<Checkbox testID="checkbox" indeterminate />, { wrapper: wrapper() })
    const checkbox = screen.getByTestId('checkbox')
    expect(checkbox).toHaveStyle({ borderColor: semantic.color.primary, backgroundColor: semantic.color.primary })
    expect(checkbox.props.accessibilityState).toMatchObject({ checked: 'mixed' })
  })

  it('controlled value takes precedence', () => {
    render(<Checkbox testID="checkbox" checked={false} onCheckedChange={jest.fn()} />, { wrapper: wrapper() })
    const checkbox = screen.getByTestId('checkbox')
    expect(checkbox.props.accessibilityState).toMatchObject({ checked: false })
    fireEvent.press(checkbox)
    // Controlled - state shouldn't change from prop
    expect(checkbox.props.accessibilityState).toMatchObject({ checked: false })
  })

  it('renders correctly in dark mode', () => {
    render(<Checkbox testID="checkbox" checked />, { wrapper: wrapper({ mode: 'dark' }) })
    const checkbox = screen.getByTestId('checkbox')
    expect(checkbox).toHaveStyle({ borderColor: semanticDark.color.primary, backgroundColor: semanticDark.color.primary })
  })

  it('applies custom semantic override', () => {
    const override = '#ff0000'
    render(<Checkbox testID="checkbox" checked />, { wrapper: wrapper({ mode: 'light', semantic: { primary: override } }) })
    const checkbox = screen.getByTestId('checkbox')
    expect(checkbox).toHaveStyle({ borderColor: override, backgroundColor: override })
  })

  it('applies accessibilityLabel', () => {
    render(<Checkbox testID="checkbox" accessibilityLabel="Accept terms" />, { wrapper: wrapper() })
    expect(screen.getByTestId('checkbox').props.accessibilityLabel).toBe('Accept terms')
  })

  it('shows checkmark when checked', () => {
    render(<Checkbox testID="checkbox" checked />, { wrapper: wrapper() })
    // The checkmark is rendered as a Text child
    expect(screen.getByTestId('checkbox').props.children).toBeTruthy()
  })
})