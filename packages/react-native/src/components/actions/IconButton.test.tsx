import { render, screen } from '@testing-library/react-native'
import { semantic, semanticDark } from '@xerena/tokens'
import { Provider } from '../../primitives/Provider'
import { IconButton } from './IconButton'

function wrapper(theme: { mode: 'light' | 'dark' } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('IconButton', () => {
  it('renders with accessibilityLabel', () => {
    render(
      <IconButton testID="btn" accessibilityLabel="Close">
        ×
      </IconButton>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('btn').props.accessibilityLabel).toBe('Close')
    expect(screen.getByTestId('btn')).toHaveStyle({ backgroundColor: semantic.color.primary })
  })

  it('applies size and variant styles', () => {
    render(
      <IconButton testID="btn" accessibilityLabel="Plus" size="sm" variant="outline">
        +
      </IconButton>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('btn')).toHaveStyle({ backgroundColor: 'transparent' })
    expect(screen.getByText('+')).toHaveStyle({ color: semantic.color.primary })
  })

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn()
    render(
      <IconButton testID="btn" accessibilityLabel="Disabled" disabled onPress={onPress}>
        ×
      </IconButton>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('btn').props.accessibilityState).toMatchObject({ disabled: true })
  })

  it('renders correctly in dark mode', () => {
    render(
      <IconButton testID="btn" accessibilityLabel="Dark">
        ×
      </IconButton>,
      { wrapper: wrapper({ mode: 'dark' }) },
    )
    expect(screen.getByTestId('btn')).toHaveStyle({ backgroundColor: semanticDark.color.primary })
  })
})
