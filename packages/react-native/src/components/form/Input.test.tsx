import { fireEvent, render, screen } from '@testing-library/react-native'
import { semantic, semanticDark } from '@xerena/tokens'
import { Provider } from '../../primitives/Provider'
import { Field } from './Field'
import { Input } from './Input'

function wrapper(theme: { mode: 'light' | 'dark'; semantic?: Record<string, string> } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Input', () => {
  it('renders outlined variant by default', () => {
    render(<Input testID="input" placeholder="Enter text" />, { wrapper: wrapper() })
    const input = screen.getByTestId('input-container')
    expect(input).toHaveStyle({ borderWidth: 1, borderColor: semantic.color.border })
    expect(input).toHaveStyle({ backgroundColor: 'transparent' })
    expect(input.props.accessibilityState).toMatchObject({ disabled: false })
  })

  it('applies filled variant styles', () => {
    render(<Input testID="input" variant="filled" placeholder="Enter text" />, { wrapper: wrapper() })
    const input = screen.getByTestId('input-container')
    expect(input).toHaveStyle({ backgroundColor: semantic.color.surface })
    expect(input).toHaveStyle({ borderWidth: 0 })
  })

  it('applies error border color', () => {
    render(<Input testID="input" error placeholder="Enter text" />, { wrapper: wrapper() })
    const input = screen.getByTestId('input-container')
    expect(input).toHaveStyle({ borderColor: semantic.color.danger })
  })

  it('applies error from Field context', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Field label="Email" error="Invalid">
          <Input testID="input" placeholder="Enter email" />
        </Field>
      </Provider>,
    )
    const input = screen.getByTestId('input-container')
    expect(input).toHaveStyle({ borderColor: semantic.color.danger })
  })

  it('applies disabled state', () => {
    render(<Input testID="input" disabled placeholder="Disabled" />, { wrapper: wrapper() })
    const input = screen.getByTestId('input-container')
    expect(input).toHaveStyle({ opacity: 0.5 })
    expect(input.props.accessibilityState).toMatchObject({ disabled: true })
  })

  it('calls onChangeText on text change', () => {
    const onChangeText = jest.fn()
    render(<Input testID="input" onChangeText={onChangeText} />, { wrapper: wrapper() })
    fireEvent.changeText(screen.getByTestId('input-input'), 'hello')
    expect(onChangeText).toHaveBeenCalledWith('hello')
  })

  it('calls onChange on text change', () => {
    const onChange = jest.fn()
    render(<Input testID="input" onChange={onChange} />, { wrapper: wrapper() })
    fireEvent.changeText(screen.getByTestId('input-input'), 'world')
    expect(onChange).toHaveBeenCalledWith('world')
  })

  it('controlled value updates', () => {
    render(<Input testID="input" value="controlled" onChangeText={jest.fn()} />, { wrapper: wrapper() })
    const textInput = screen.getByTestId('input-input')
    expect(textInput.props.value).toBe('controlled')
  })

  it('renders correctly in dark mode', () => {
    render(<Input testID="input" placeholder="Dark" />, { wrapper: wrapper({ mode: 'dark' }) })
    const input = screen.getByTestId('input-container')
    expect(input).toHaveStyle({ borderColor: semanticDark.color.border })
  })

  it('applies custom semantic override', () => {
    const override = '#ff0000'
    render(<Input testID="input" error />, { wrapper: wrapper({ mode: 'light', semantic: { danger: override } }) })
    const input = screen.getByTestId('input-container')
    expect(input).toHaveStyle({ borderColor: override })
  })

  it('applies variant filled in dark mode', () => {
    render(<Input testID="input" variant="filled" />, { wrapper: wrapper({ mode: 'dark' }) })
    const input = screen.getByTestId('input-container')
    expect(input).toHaveStyle({ backgroundColor: semanticDark.color.surface })
  })
})