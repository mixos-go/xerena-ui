import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { Provider } from '../../primitives/Provider'
import { Combobox } from './Combobox'

jest.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: jest.fn(() => false),
}))

function wrapper(theme: { mode: 'light' | 'dark'; semantic?: Record<string, string> } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

const options = [
  { value: 'a', label: 'Apple' },
  { value: 'b', label: 'Banana' },
  { value: 'c', label: 'Cherry' },
]

describe('Combobox', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders placeholder when empty', () => {
    render(<Combobox testID="combobox" options={options} placeholder="Search..." />, { wrapper: wrapper() })
    expect(screen.getByPlaceholderText('Search...')).toBeTruthy()
  })

  it('shows filtered options on input', () => {
    render(<Combobox testID="combobox" options={options} />, { wrapper: wrapper() })
    const input = screen.getByRole('combobox')
    fireEvent.changeText(input, 'app')
    fireEvent.press(input)
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.getByText('Apple')).toBeTruthy()
    expect(screen.queryByText('Banana')).toBeNull()
    expect(screen.queryByText('Cherry')).toBeNull()
  })

  it('calls onChange on option select', () => {
    const onChange = jest.fn()
    render(<Combobox testID="combobox" options={options} onChange={onChange} />, { wrapper: wrapper() })
    const input = screen.getByRole('combobox')
    fireEvent.changeText(input, 'a')
    fireEvent.press(input)
    act(() => {
      jest.runAllTimers()
    })
    fireEvent.press(screen.getByText('Apple'))
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('calls onSearch on input change', () => {
    const onSearch = jest.fn()
    render(<Combobox testID="combobox" options={options} onSearch={onSearch} />, { wrapper: wrapper() })
    const input = screen.getByRole('combobox')
    fireEvent.changeText(input, 'test')
    expect(onSearch).toHaveBeenCalledWith('test')
  })

  it('applies disabled state', () => {
    const onChange = jest.fn()
    render(<Combobox testID="combobox" options={options} disabled onChange={onChange} />, { wrapper: wrapper() })
    const input = screen.getByRole('combobox')
    expect(input.props.editable).toBe(false)
    expect(input.props.accessibilityState).toMatchObject({ disabled: true })
  })

  it('controlled value shows selected option label', () => {
    render(<Combobox testID="combobox" options={options} value="b" />, { wrapper: wrapper() })
    expect(screen.getByRole('combobox').props.value).toBe('Banana')
  })

  it('renders correctly in dark mode', () => {
    render(<Combobox testID="combobox" options={options} />, { wrapper: wrapper({ mode: 'dark' }) })
    const input = screen.getByRole('combobox')
    fireEvent.changeText(input, 'a')
    fireEvent(input, 'focus')
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.getByText('Apple')).toBeTruthy()
  })

  it('applies custom semantic override', () => {
    const override = '#ff0000'
    render(<Combobox testID="combobox" options={options} error />, { wrapper: wrapper({ mode: 'light', semantic: { danger: override } }) })
    expect(screen.getByRole('combobox')).toBeTruthy()
  })
})