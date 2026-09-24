import { fireEvent, render, screen } from '@testing-library/react-native'
import { Provider } from '../../primitives/Provider'
import { CheckboxGroup, CheckboxGroupItem } from './CheckboxGroup'

function wrapper(theme: { mode: 'light' | 'dark'; semantic?: Record<string, string> } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('CheckboxGroup', () => {
  it('renders group', () => {
    render(
      <CheckboxGroup testID="checkboxgroup">
        <CheckboxGroupItem testID="item1" value="a">Option A</CheckboxGroupItem>
        <CheckboxGroupItem testID="item2" value="b">Option B</CheckboxGroupItem>
      </CheckboxGroup>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('checkboxgroup')).toBeTruthy()
  })

  it('toggles item on press', () => {
    const onValueChange = jest.fn()
    render(
      <CheckboxGroup testID="checkboxgroup" onValueChange={onValueChange}>
        <CheckboxGroupItem testID="item1" value="a">Option A</CheckboxGroupItem>
        <CheckboxGroupItem testID="item2" value="b">Option B</CheckboxGroupItem>
      </CheckboxGroup>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('item1'))
    expect(onValueChange).toHaveBeenCalledWith(['a'])
    fireEvent.press(screen.getByTestId('item2'))
    expect(onValueChange).toHaveBeenCalledWith(['a', 'b'])
    fireEvent.press(screen.getByTestId('item1'))
    expect(onValueChange).toHaveBeenCalledWith(['b'])
  })

  it('shows checked state for selected values', () => {
    render(
      <CheckboxGroup testID="checkboxgroup" value={['a', 'c']}>
        <CheckboxGroupItem testID="item1" value="a">Option A</CheckboxGroupItem>
        <CheckboxGroupItem testID="item2" value="b">Option B</CheckboxGroupItem>
        <CheckboxGroupItem testID="item3" value="c">Option C</CheckboxGroupItem>
      </CheckboxGroup>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('item1').props.accessibilityState).toMatchObject({ checked: true })
    expect(screen.getByTestId('item2').props.accessibilityState).toMatchObject({ checked: false })
    expect(screen.getByTestId('item3').props.accessibilityState).toMatchObject({ checked: true })
  })

  it('applies disabled state to group', () => {
    const onValueChange = jest.fn()
    render(
      <CheckboxGroup testID="checkboxgroup" disabled onValueChange={onValueChange}>
        <CheckboxGroupItem testID="item1" value="a">Option A</CheckboxGroupItem>
      </CheckboxGroup>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('item1'))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('applies disabled state to individual item', () => {
    const onValueChange = jest.fn()
    render(
      <CheckboxGroup testID="checkboxgroup" onValueChange={onValueChange}>
        <CheckboxGroupItem testID="item1" value="a" disabled>Option A</CheckboxGroupItem>
      </CheckboxGroup>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('item1'))
    expect(onValueChange).not.toHaveBeenCalled()
    expect(screen.getByTestId('item1').props.accessibilityState).toMatchObject({ disabled: true })
  })

  it('renders indeterminate state', () => {
    render(
      <CheckboxGroup testID="checkboxgroup">
        <CheckboxGroupItem testID="item1" value="a" indeterminate>Option A</CheckboxGroupItem>
      </CheckboxGroup>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('item1').props.accessibilityState).toMatchObject({ checked: 'mixed' })
  })

  it('controlled value takes precedence', () => {
    render(
      <CheckboxGroup testID="checkboxgroup" value={['a']} onValueChange={jest.fn()}>
        <CheckboxGroupItem testID="item1" value="a">Option A</CheckboxGroupItem>
        <CheckboxGroupItem testID="item2" value="b">Option B</CheckboxGroupItem>
      </CheckboxGroup>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('item2'))
    expect(screen.getByTestId('item1').props.accessibilityState).toMatchObject({ checked: true })
    expect(screen.getByTestId('item2').props.accessibilityState).toMatchObject({ checked: false })
  })

  it('renders correctly in dark mode', () => {
    render(
      <CheckboxGroup testID="checkboxgroup" value={['a']}>
        <CheckboxGroupItem testID="item1" value="a">Option A</CheckboxGroupItem>
      </CheckboxGroup>,
      { wrapper: wrapper({ mode: 'dark' }) },
    )
    expect(screen.getByTestId('item1')).toBeTruthy()
  })

  it('applies custom semantic override', () => {
    const override = '#ff0000'
    render(
      <CheckboxGroup testID="checkboxgroup" value={['a']}>
        <CheckboxGroupItem testID="item1" value="a">Option A</CheckboxGroupItem>
      </CheckboxGroup>,
      { wrapper: wrapper({ mode: 'light', semantic: { primary: override } }) },
    )
    expect(screen.getByTestId('item1')).toBeTruthy()
  })
})