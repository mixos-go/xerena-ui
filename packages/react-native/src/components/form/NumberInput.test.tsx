import { fireEvent, render, screen } from '@testing-library/react-native'
import { Provider } from '../../primitives/Provider'
import { NumberInput } from './NumberInput'

function wrapper(theme: { mode: 'light' | 'dark'; semantic?: Record<string, string> } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('NumberInput', () => {
  it('renders with default value', () => {
    render(<NumberInput testID="num" />, { wrapper: wrapper() })
    expect(screen.getByTestId('num-input').props.value).toBe('0')
    expect(screen.getByTestId('num-input').props.accessibilityRole).toBe('spinbutton')
  })

  it('renders defaultValue', () => {
    render(<NumberInput testID="num" defaultValue={5} />, { wrapper: wrapper() })
    expect(screen.getByTestId('num-input').props.value).toBe('5')
  })

  it('increments by step on increment press', () => {
    const onValueChange = jest.fn()
    render(<NumberInput testID="num" defaultValue={5} step={2} onValueChange={onValueChange} />, { wrapper: wrapper() })
    fireEvent.press(screen.getByTestId('num-increment'))
    expect(onValueChange).toHaveBeenCalledWith(7)
  })

  it('decrements by step on decrement press', () => {
    const onValueChange = jest.fn()
    render(<NumberInput testID="num" defaultValue={5} step={2} onValueChange={onValueChange} />, { wrapper: wrapper() })
    fireEvent.press(screen.getByTestId('num-decrement'))
    expect(onValueChange).toHaveBeenCalledWith(3)
  })

  it('clamps to max', () => {
    const onValueChange = jest.fn()
    render(<NumberInput testID="num" defaultValue={9} max={10} step={5} onValueChange={onValueChange} />, { wrapper: wrapper() })
    fireEvent.press(screen.getByTestId('num-increment'))
    expect(onValueChange).toHaveBeenCalledWith(10)
  })

  it('clamps to min', () => {
    const onValueChange = jest.fn()
    render(<NumberInput testID="num" defaultValue={1} min={0} step={5} onValueChange={onValueChange} />, { wrapper: wrapper() })
    fireEvent.press(screen.getByTestId('num-decrement'))
    expect(onValueChange).toHaveBeenCalledWith(0)
  })

  it('disables increment at max and decrement at min', () => {
    render(<NumberInput testID="num" defaultValue={10} min={0} max={10} />, { wrapper: wrapper() })
    expect(screen.getByTestId('num-increment').props.accessibilityState?.disabled).toBe(true)
    render(<NumberInput testID="num2" defaultValue={0} min={0} max={10} />, { wrapper: wrapper() })
    expect(screen.getByTestId('num2-decrement').props.accessibilityState?.disabled).toBe(true)
  })

  it('applies disabled state', () => {
    const onValueChange = jest.fn()
    render(<NumberInput testID="num" defaultValue={5} disabled onValueChange={onValueChange} />, { wrapper: wrapper() })
    expect(screen.getByTestId('num-input').props.editable).toBe(false)
    fireEvent.press(screen.getByTestId('num-increment'))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('supports controlled value', () => {
    const onValueChange = jest.fn()
    render(<NumberInput testID="num" value={4} onValueChange={onValueChange} />, { wrapper: wrapper() })
    expect(screen.getByTestId('num-input').props.value).toBe('4')
    fireEvent.press(screen.getByTestId('num-increment'))
    expect(onValueChange).toHaveBeenCalledWith(5)
  })

  it('supports uncontrolled value via defaultValue', () => {
    render(<NumberInput testID="num" defaultValue={3} />, { wrapper: wrapper() })
    fireEvent.changeText(screen.getByTestId('num-input'), '8')
    expect(screen.getByTestId('num-input').props.value).toBe('8')
  })

  it('renders compact variant with side steppers', () => {
    render(<NumberInput testID="num" variant="compact" defaultValue={5} />, { wrapper: wrapper() })
    expect(screen.getByTestId('num-increment')).toBeTruthy()
    expect(screen.getByTestId('num-decrement')).toBeTruthy()
  })

  it('renders correctly in dark mode', () => {
    render(<NumberInput testID="num" defaultValue={5} />, { wrapper: wrapper({ mode: 'dark' }) })
    expect(screen.getByTestId('num-input')).toBeTruthy()
  })

  it('applies custom semantic override', () => {
    const override = '#ff0000'
    render(<NumberInput testID="num" defaultValue={5} />, { wrapper: wrapper({ mode: 'light', semantic: { primary: override } }) })
    expect(screen.getByTestId('num-input')).toBeTruthy()
  })
})
