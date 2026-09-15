import { Text, View } from 'react-native'
import { render, screen } from '@testing-library/react-native'
import { semantic } from '@xerena/tokens'
import { Provider } from '../../primitives/Provider'
import { Stack } from './Stack'

function wrapper(theme: { mode: 'light' | 'dark' } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Stack', () => {
  it('renders vertical stack with gap spacing token', () => {
    render(
      <Stack testID="stack" orientation="vertical" spacing="md">
        a
      </Stack>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('stack')).toHaveStyle({ flexDirection: 'column' })
    expect(screen.getByTestId('stack')).toHaveStyle({ gap: semantic.spacing.md })
  })

  it('renders horizontal stack', () => {
    render(
      <Stack testID="stack" orientation="horizontal">
        a
      </Stack>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('stack')).toHaveStyle({ flexDirection: 'row' })
  })

  it('renders inline stack', () => {
    render(
      <Stack testID="stack" orientation="inline">
        a
      </Stack>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('stack')).toHaveStyle({ flexDirection: 'row', flexWrap: 'wrap' })
  })

  it('applies alignment and wrap', () => {
    render(
      <Stack testID="stack" alignItems="center" justifyContent="space-between" wrap>
        a
      </Stack>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('stack')).toHaveStyle({ alignItems: 'center' })
    expect(screen.getByTestId('stack')).toHaveStyle({ justifyContent: 'space-between' })
    expect(screen.getByTestId('stack')).toHaveStyle({ flexWrap: 'wrap' })
  })

  it('renders with as prop', () => {
    function Custom(props: { children: React.ReactNode }) {
      return <View {...props} testID="custom" />
    }
    render(
      <Stack testID="stack" as={Custom}>
        a
      </Stack>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('custom')).toBeTruthy()
  })
})
