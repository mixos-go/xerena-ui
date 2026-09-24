import { render, screen } from '@testing-library/react-native'
import { semantic, semanticDark } from '@xerena/tokens'
import { Provider } from '../../primitives/Provider'
import { InputGroup, InputGroupAddon } from './InputGroup'
import { Input } from './Input'

function wrapper(theme: { mode: 'light' | 'dark'; semantic?: Record<string, string> } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('InputGroup', () => {
  it('renders children in a row', () => {
    render(
      <InputGroup testID="inputgroup">
        <Input testID="input1" placeholder="First" />
        <Input testID="input2" placeholder="Second" />
      </InputGroup>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('inputgroup')).toBeTruthy()
    expect(screen.getByTestId('input1-container')).toBeTruthy()
    expect(screen.getByTestId('input2-container')).toBeTruthy()
  })

  it('applies error border color', () => {
    render(
      <InputGroup testID="inputgroup" error>
        <View testID="child" />
      </InputGroup>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('inputgroup')).toHaveStyle({ borderColor: semantic.color.danger })
  })

  it('renders addon on left', () => {
    render(
      <InputGroup testID="inputgroup">
        <InputGroupAddon testID="addon" position="left">$</InputGroupAddon>
        <Input testID="input" placeholder="Amount" />
      </InputGroup>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('addon')).toBeTruthy()
    expect(screen.getByTestId('addon').props.style).toEqual(
      expect.objectContaining({ borderRightWidth: 1 }),
    )
  })

  it('renders addon on right', () => {
    render(
      <InputGroup testID="inputgroup">
        <Input testID="input" placeholder="Search" />
        <InputGroupAddon testID="addon" position="right">🔍</InputGroupAddon>
      </InputGroup>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('addon')).toBeTruthy()
    expect(screen.getByTestId('addon').props.style).toEqual(
      expect.objectContaining({ borderLeftWidth: 1 }),
    )
  })

  it('applies error styling to addons', () => {
    render(
      <InputGroup testID="inputgroup" error>
        <InputGroupAddon testID="addon" position="left">$</InputGroupAddon>
        <Input testID="input" placeholder="Amount" />
      </InputGroup>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('addon')).toHaveStyle({ backgroundColor: semantic.color.dangerSurface })
    expect(screen.getByTestId('addon')).toHaveStyle({ borderColor: semantic.color.danger })
  })

  it('renders correctly in dark mode', () => {
    render(
      <InputGroup testID="inputgroup">
        <Input testID="input" placeholder="Test" />
      </InputGroup>,
      { wrapper: wrapper({ mode: 'dark' }) },
    )
    expect(screen.getByTestId('inputgroup')).toHaveStyle({ borderColor: semanticDark.color.border })
  })

  it('applies custom semantic override', () => {
    const override = '#ff0000'
    render(
      <InputGroup testID="inputgroup" error>
        <View testID="child" />
      </InputGroup>,
      { wrapper: wrapper({ mode: 'light', semantic: { danger: override } }) },
    )
    expect(screen.getByTestId('inputgroup')).toHaveStyle({ borderColor: override })
  })
})

import { View } from 'react-native'