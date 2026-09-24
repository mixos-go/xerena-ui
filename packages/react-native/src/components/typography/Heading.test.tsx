import { Text as RNText } from 'react-native'
import { render, screen } from '@testing-library/react-native'
import { Provider } from '../../primitives/Provider'
import { display } from '../../styles/typography'
import { Heading } from './Heading'

function wrapper(theme: { mode: 'light' | 'dark' } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Heading', () => {
  it('renders default h2 size', () => {
    render(<Heading testID="h">Title</Heading>, { wrapper: wrapper() })
    expect(screen.getByTestId('h')).toHaveStyle({ fontSize: display.lg.fontSize })
  })

  it.each([
    ['h1', display.xl.fontSize],
    ['h2', display.lg.fontSize],
    ['h3', display.md.fontSize],
    ['h4', display.sm.fontSize],
    ['h5', display.xs.fontSize],
    ['h6', display.xs.fontSize],
  ] as const)('maps %s to display size', (as, fontSize) => {
    render(
      <Heading testID="h" as={as}>
        Title
      </Heading>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('h')).toHaveStyle({ fontSize })
  })

  it('renders with as prop', () => {
    function Custom(props: { children: React.ReactNode }) {
      return <RNText {...props} testID="custom" />
    }
    render(
      <Heading testID="h" as={Custom}>
        Title
      </Heading>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('custom')).toBeTruthy()
  })
})
