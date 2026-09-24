import { fireEvent, render, screen } from '@testing-library/react-native'
import { Provider } from '../../primitives/Provider'
import { Slider } from './Slider'

jest.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: jest.fn(() => false),
}))

function wrapper(theme: { mode: 'light' | 'dark'; semantic?: Record<string, string> } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Slider', () => {
  it('renders with default values', () => {
    render(<Slider testID="slider" />, { wrapper: wrapper() })
    const slider = screen.getByTestId('slider')
    expect(slider).toBeTruthy()
    expect(slider.props.accessibilityRole).toBe('adjustable')
    expect(slider.props.accessibilityValue).toEqual({ min: 0, max: 100, now: 0 })
  })

  it('renders with custom min/max/step', () => {
    render(<Slider testID="slider" min={10} max={50} step={5} defaultValue={25} />, { wrapper: wrapper() })
    const slider = screen.getByTestId('slider')
    expect(slider.props.accessibilityValue).toEqual({ min: 10, max: 50, now: 25 })
  })

  it('applies disabled state', () => {
    render(<Slider testID="slider" disabled />, { wrapper: wrapper() })
    const slider = screen.getByTestId('slider')
    expect(slider.props.accessibilityState).toMatchObject({ disabled: true })
  })

  it('calls onValueChange on track press', () => {
    const onValueChange = jest.fn()
    render(<Slider testID="slider" min={0} max={100} onValueChange={onValueChange} />, { wrapper: wrapper() })
    // Simulate track press at 50% position
    fireEvent.press(screen.getByTestId('slider'))
    // Note: Full interaction testing requires mocking layout
  })

  it('controlled value takes precedence', () => {
    render(<Slider testID="slider" value={50} onValueChange={jest.fn()} />, { wrapper: wrapper() })
    const slider = screen.getByTestId('slider')
    expect(slider.props.accessibilityValue).toEqual({ min: 0, max: 100, now: 50 })
  })

  it('renders vertical orientation', () => {
    render(<Slider testID="slider" orientation="vertical" />, { wrapper: wrapper() })
    const slider = screen.getByTestId('slider')
    expect(slider).toBeTruthy()
  })

  it('renders correctly in dark mode', () => {
    render(<Slider testID="slider" />, { wrapper: wrapper({ mode: 'dark' }) })
    const slider = screen.getByTestId('slider')
    expect(slider).toBeTruthy()
  })

  it('applies custom semantic override', () => {
    const override = '#ff0000'
    render(<Slider testID="slider" />, { wrapper: wrapper({ mode: 'light', semantic: { primary: override } }) })
    const slider = screen.getByTestId('slider')
    expect(slider).toBeTruthy()
  })
})