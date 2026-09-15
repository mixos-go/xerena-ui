import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { semantic, semanticDark } from '@xerena/tokens'
import { Provider } from '../../primitives/Provider'
import { Card } from './Card'

function wrapper(theme: { mode: 'light' | 'dark' } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Card', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it.each([
    ['outlined', semantic.color.background, semantic.color.border],
    ['elevated', semantic.color.background, undefined],
    ['soft', semantic.color.surface, undefined],
    ['flat', 'transparent', undefined],
  ] as const)('applies %s variant', (variant, bg, border) => {
    render(
      <Card testID="card" variant={variant}>
        c
      </Card>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('card')).toHaveStyle({ backgroundColor: bg })
    if (border) {
      expect(screen.getByTestId('card')).toHaveStyle({ borderColor: border, borderWidth: 1 })
    }
  })

  it('applies padding', () => {
    render(
      <Card testID="card" padding="md">
        c
      </Card>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('card')).toHaveStyle({ padding: semantic.spacing.md })
  })

  it('interactive card is pressable and calls onPress', () => {
    const onPress = jest.fn()
    render(
      <Card testID="card" variant="interactive" onPress={onPress}>
        c
      </Card>,
      { wrapper: wrapper() },
    )
    act(() => {
      fireEvent.press(screen.getByTestId('card'))
      jest.runOnlyPendingTimers()
    })
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('renders correctly in dark mode', () => {
    render(
      <Card testID="card" variant="soft">
        Dark
      </Card>,
      { wrapper: wrapper({ mode: 'dark' }) },
    )
    expect(screen.getByTestId('card')).toHaveStyle({ backgroundColor: semanticDark.color.surface })
  })
})
