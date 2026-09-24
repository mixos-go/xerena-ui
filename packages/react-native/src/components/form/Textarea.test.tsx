import { fireEvent, render, screen } from '@testing-library/react-native'
import { semantic, semanticDark } from '@xerena/tokens'
import { Provider } from '../../primitives/Provider'
import { Field } from './Field'
import { Textarea } from './Textarea'

function wrapper(theme: { mode: 'light' | 'dark'; semantic?: Record<string, string> } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Textarea', () => {
  it('renders with default styles', () => {
    render(<Textarea testID="textarea" placeholder="Enter text" />, { wrapper: wrapper() })
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveStyle({ borderWidth: 1, borderColor: semantic.color.border })
    expect(textarea).toHaveStyle({ minHeight: 100 })
    const textInput = screen.getByTestId('textarea-input')
    expect(textInput.props.disabled).toBe(false)
    expect(textInput.props.editable).toBe(true)
  })

  it('applies error border color', () => {
    render(<Textarea testID="textarea" error placeholder="Enter text" />, { wrapper: wrapper() })
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveStyle({ borderColor: semantic.color.danger })
  })

  it('applies error from Field context', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Field label="Message" error="Required">
          <Textarea testID="textarea" placeholder="Enter message" />
        </Field>
      </Provider>,
    )
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveStyle({ borderColor: semantic.color.danger })
  })

  it('applies disabled state', () => {
    render(<Textarea testID="textarea" disabled placeholder="Disabled" />, { wrapper: wrapper() })
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveStyle({ opacity: 0.5 })
    const textInput = screen.getByTestId('textarea-input')
    expect(textInput.props.disabled).toBe(true)
    expect(textInput.props.editable).toBe(false)
  })

  it('calls onChangeText on text change', () => {
    const onChangeText = jest.fn()
    render(<Textarea testID="textarea" onChangeText={onChangeText} />, { wrapper: wrapper() })
    fireEvent.changeText(screen.getByTestId('textarea-input'), 'hello world')
    expect(onChangeText).toHaveBeenCalledWith('hello world')
  })

  it('calls onChange on text change', () => {
    const onChange = jest.fn()
    render(<Textarea testID="textarea" onChange={onChange} />, { wrapper: wrapper() })
    fireEvent.changeText(screen.getByTestId('textarea-input'), 'test')
    expect(onChange).toHaveBeenCalledWith('test')
  })

  it('controlled value updates', () => {
    render(<Textarea testID="textarea" value="controlled" onChangeText={jest.fn()} />, { wrapper: wrapper() })
    const textInput = screen.getByTestId('textarea-input')
    expect(textInput.props.value).toBe('controlled')
  })

  it('renders correctly in dark mode', () => {
    render(<Textarea testID="textarea" placeholder="Dark" />, { wrapper: wrapper({ mode: 'dark' }) })
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveStyle({ borderColor: semanticDark.color.border })
  })

  it('applies custom semantic override', () => {
    const override = '#ff0000'
    render(<Textarea testID="textarea" error />, { wrapper: wrapper({ mode: 'light', semantic: { danger: override } }) })
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveStyle({ borderColor: override })
  })

  it('applies minHeight prop', () => {
    render(<Textarea testID="textarea" minHeight={200} />, { wrapper: wrapper() })
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveStyle({ minHeight: 200 })
  })
})