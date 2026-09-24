import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { semantic, semanticDark } from '@xerena/tokens'
import { Provider } from '../../primitives/Provider'
import { Field } from './Field'
import { Select } from './Select'

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

describe('Select', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders placeholder when no value selected', () => {
    render(<Select testID="select" options={options} placeholder="Choose..." />, { wrapper: wrapper() })
    expect(screen.getByTestId('select-trigger')).toBeTruthy()
    expect(screen.getByText('Choose...')).toBeTruthy()
  })

  it('renders selected option label', () => {
    render(<Select testID="select" options={options} value="b" />, { wrapper: wrapper() })
    expect(screen.getByText('Banana')).toBeTruthy()
  })

  it('opens ListOverlay on press', () => {
    render(<Select testID="select" options={options} />, { wrapper: wrapper() })
    expect(screen.queryByText('Apple')).toBeNull()
    fireEvent.press(screen.getByTestId('select-trigger'))
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.getByText('Apple')).toBeTruthy()
    expect(screen.getByText('Banana')).toBeTruthy()
    expect(screen.getByText('Cherry')).toBeTruthy()
  })

  it('calls onValueChange and closes on option select', () => {
    const onValueChange = jest.fn()
    render(<Select testID="select" options={options} onValueChange={onValueChange} />, { wrapper: wrapper() })
    fireEvent.press(screen.getByTestId('select-trigger'))
    act(() => {
      jest.runAllTimers()
    })
    fireEvent.press(screen.getByText('Cherry'))
    act(() => {
      jest.runAllTimers()
    })
    expect(onValueChange).toHaveBeenCalledWith('c')
    expect(screen.queryByText('Apple')).toBeNull()
  })

  it('applies disabled state', () => {
    const onValueChange = jest.fn()
    render(<Select testID="select" options={options} disabled onValueChange={onValueChange} />, { wrapper: wrapper() })
    fireEvent.press(screen.getByTestId('select-trigger'))
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.queryByText('Apple')).toBeNull()
    expect(onValueChange).not.toHaveBeenCalled()
    expect(screen.getByTestId('select-trigger').props.accessibilityState).toMatchObject({ disabled: true, expanded: false })
  })

  it('applies error border color', () => {
    render(<Select testID="select" options={options} error />, { wrapper: wrapper() })
    const trigger = screen.getByTestId('select-trigger')
    expect(trigger).toHaveStyle({ borderColor: semantic.color.danger })
  })

  it('applies error from Field context', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Field label="Fruit" error="Required">
          <Select testID="select" options={options} />
        </Field>
      </Provider>,
    )
    const trigger = screen.getByTestId('select-trigger')
    expect(trigger).toHaveStyle({ borderColor: semantic.color.danger })
  })

  it('renders correctly in dark mode', () => {
    render(<Select testID="select" options={options} />, { wrapper: wrapper({ mode: 'dark' }) })
    fireEvent.press(screen.getByTestId('select-trigger'))
    act(() => {
      jest.runAllTimers()
    })
    const menu = screen.UNSAFE_getByProps({ accessibilityRole: 'menu' })
    expect(menu.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: semanticDark.color.background }),
        expect.objectContaining({ borderColor: semanticDark.color.border }),
      ]),
    )
  })

  it('applies custom semantic override', () => {
    const override = '#ff0000'
    render(<Select testID="select" options={options} error />, { wrapper: wrapper({ mode: 'light', semantic: { danger: override } }) })
    const trigger = screen.getByTestId('select-trigger')
    expect(trigger).toHaveStyle({ borderColor: override })
  })

  it('applies accessibilityRole combobox', () => {
    render(<Select testID="select" options={options} />, { wrapper: wrapper() })
    expect(screen.getByTestId('select-trigger').props.accessibilityRole).toBe('combobox')
  })
})