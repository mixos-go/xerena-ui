import { Text } from 'react-native'
import { fireEvent, render, screen } from '@testing-library/react-native'
import { semantic, semanticDark } from '@xerena/tokens'
import { Provider } from '../../primitives/Provider'
import { Button } from './Button'

function wrapper(theme: { mode: 'light' | 'dark'; semantic?: Record<string, string> } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Button', () => {
  it('renders primary variant by default', () => {
    render(<Button testID="btn">Click</Button>, { wrapper: wrapper() })
    expect(screen.getByTestId('btn')).toHaveStyle({ backgroundColor: semantic.color.primary })
    expect(screen.getByText('Click')).toHaveStyle({ color: semantic.color.textOnStrong })
  })

  it.each([
    ['primary', semantic.color.primary, semantic.color.textOnStrong, undefined],
    ['destructive', semantic.color.danger, semantic.color.textOnStrong, undefined],
    ['outline', 'transparent', semantic.color.primary, semantic.color.primary],
    ['ghost', 'transparent', semantic.color.primary, undefined],
    ['soft', semantic.color.surfaceHover, semantic.color.primary, undefined],
    ['link', 'transparent', semantic.color.primary, undefined],
  ] as const)('applies %s variant styles', (variant, bg, color, border) => {
    render(
      <Button testID="btn" variant={variant}>
        {variant}
      </Button>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('btn')).toHaveStyle({ backgroundColor: bg })
    expect(screen.getByText(variant)).toHaveStyle({ color })
    if (border) {
      expect(screen.getByTestId('btn')).toHaveStyle({ borderColor: border, borderWidth: 1 })
    }
  })

  it.each([
    ['sm', semantic.spacing.sm],
    ['md', semantic.spacing.md],
    ['lg', semantic.spacing.lg],
  ] as const)('applies %s size padding', (size, pad) => {
    render(
      <Button testID="btn" size={size}>
        {size}
      </Button>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('btn')).toHaveStyle({ paddingHorizontal: pad })
  })

  it('wires leftIcon and rightIcon around children', () => {
    render(
      <Button leftIcon={<Text testID="left">←</Text>} rightIcon={<Text testID="right">→</Text>}>
        Go
      </Button>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('left')).toBeTruthy()
    expect(screen.getByTestId('right')).toBeTruthy()
    expect(screen.getByText('Go')).toBeTruthy()
  })

  it('calls onPress when pressed', () => {
    const onPress = jest.fn()
    render(<Button onPress={onPress}>Press</Button>, { wrapper: wrapper() })
    fireEvent.press(screen.getByText('Press'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn()
    render(
      <Button disabled onPress={onPress}>
        Disabled
      </Button>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByText('Disabled'))
    expect(onPress).not.toHaveBeenCalled()
  })

  it('does not call onPress when loading and marks busy', () => {
    const onPress = jest.fn()
    render(
      <Button testID="btn" loading onPress={onPress}>
        Loading
      </Button>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByText('Loading'))
    expect(onPress).not.toHaveBeenCalled()
    expect(screen.getByTestId('btn').props.accessibilityState).toMatchObject({ busy: true })
  })

  it('applies fullWidth', () => {
    render(
      <Button testID="btn" fullWidth>
        Wide
      </Button>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('btn')).toHaveStyle({ width: '100%' })
  })

  it('marks selected state', () => {
    render(
      <Button testID="btn" selected>
        Selected
      </Button>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('btn').props.accessibilityState).toMatchObject({ selected: true })
  })

  it('renders correctly in dark mode', () => {
    render(
      <Button testID="btn" variant="primary">
        Dark
      </Button>,
      { wrapper: wrapper({ mode: 'dark' }) },
    )
    expect(screen.getByTestId('btn')).toHaveStyle({ backgroundColor: semanticDark.color.primary })
  })

  it('applies custom semantic override', () => {
    const override = '#ff0000'
    render(
      <Button testID="btn" variant="primary">
        Override
      </Button>,
      { wrapper: wrapper({ mode: 'light', semantic: { primary: override } }) },
    )
    expect(screen.getByTestId('btn')).toHaveStyle({ backgroundColor: override })
  })
})
