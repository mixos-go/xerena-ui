import { fireEvent, render, screen } from '@testing-library/react-native'
import { Provider } from '../../primitives/Provider'
import { RadioGroup, RadioGroupItem } from './RadioGroup'

function wrapper(theme: { mode: 'light' | 'dark'; semantic?: Record<string, string> } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('RadioGroup', () => {
  it('renders with vertical orientation by default', () => {
    render(
      <RadioGroup testID="radiogroup">
        <RadioGroupItem testID="item1" value="a">Option A</RadioGroupItem>
        <RadioGroupItem testID="item2" value="b">Option B</RadioGroupItem>
      </RadioGroup>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('radiogroup')).toBeTruthy()
  })

  it('applies horizontal orientation', () => {
    render(
      <RadioGroup testID="radiogroup" orientation="horizontal">
        <RadioGroupItem testID="item1" value="a">Option A</RadioGroupItem>
        <RadioGroupItem testID="item2" value="b">Option B</RadioGroupItem>
      </RadioGroup>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('radiogroup').props.style).toEqual(
      expect.objectContaining({ flexDirection: 'row' }),
    )
  })

  it('selects item on press', () => {
    const onValueChange = jest.fn()
    render(
      <RadioGroup testID="radiogroup" onValueChange={onValueChange}>
        <RadioGroupItem testID="item1" value="a">Option A</RadioGroupItem>
        <RadioGroupItem testID="item2" value="b">Option B</RadioGroupItem>
      </RadioGroup>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('item2'))
    expect(onValueChange).toHaveBeenCalledWith('b')
  })

  it('shows checked state for selected value', () => {
    render(
      <RadioGroup testID="radiogroup" value="b">
        <RadioGroupItem testID="item1" value="a">Option A</RadioGroupItem>
        <RadioGroupItem testID="item2" value="b">Option B</RadioGroupItem>
      </RadioGroup>,
      { wrapper: wrapper() },
    )
    const item2 = screen.getByTestId('item2')
    expect(item2.props.accessibilityState).toMatchObject({ checked: true })
    const item1 = screen.getByTestId('item1')
    expect(item1.props.accessibilityState).toMatchObject({ checked: false })
  })

  it('applies disabled state to group', () => {
    const onValueChange = jest.fn()
    render(
      <RadioGroup testID="radiogroup" disabled onValueChange={onValueChange}>
        <RadioGroupItem testID="item1" value="a">Option A</RadioGroupItem>
      </RadioGroup>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('item1'))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('applies disabled state to individual item', () => {
    const onValueChange = jest.fn()
    render(
      <RadioGroup testID="radiogroup" onValueChange={onValueChange}>
        <RadioGroupItem testID="item1" value="a" disabled>Option A</RadioGroupItem>
      </RadioGroup>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('item1'))
    expect(onValueChange).not.toHaveBeenCalled()
    expect(screen.getByTestId('item1').props.accessibilityState).toMatchObject({ disabled: true })
  })

  it('controlled value takes precedence', () => {
    render(
      <RadioGroup testID="radiogroup" value="a" onValueChange={jest.fn()}>
        <RadioGroupItem testID="item1" value="a">Option A</RadioGroupItem>
        <RadioGroupItem testID="item2" value="b">Option B</RadioGroupItem>
      </RadioGroup>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('item2'))
    // Controlled - should remain checked on 'a'
    expect(screen.getByTestId('item1').props.accessibilityState).toMatchObject({ checked: true })
    expect(screen.getByTestId('item2').props.accessibilityState).toMatchObject({ checked: false })
  })

  it('renders correctly in dark mode', () => {
    render(
      <RadioGroup testID="radiogroup" value="a">
        <RadioGroupItem testID="item1" value="a">Option A</RadioGroupItem>
      </RadioGroup>,
      { wrapper: wrapper({ mode: 'dark' }) },
    )
    expect(screen.getByTestId('item1')).toBeTruthy()
  })

  it('applies custom semantic override', () => {
    const override = '#ff0000'
    render(
      <RadioGroup testID="radiogroup" value="a">
        <RadioGroupItem testID="item1" value="a">Option A</RadioGroupItem>
      </RadioGroup>,
      { wrapper: wrapper({ mode: 'light', semantic: { primary: override } }) },
    )
    expect(screen.getByTestId('item1')).toBeTruthy()
  })
})