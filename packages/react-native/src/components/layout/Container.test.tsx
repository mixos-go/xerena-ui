import { View } from 'react-native'
import { render, screen } from '@testing-library/react-native'
import { Provider } from '../../primitives/Provider'
import { Container } from './Container'

function wrapper(theme: { mode: 'light' | 'dark' } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Container', () => {
  it.each([
    ['sm', 640],
    ['md', 768],
    ['lg', 1024],
    ['xl', 1280],
  ] as const)('renders centered %s container with max-width', (size, maxWidth) => {
    render(
      <Container testID="container" size={size}>
        c
      </Container>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('container')).toHaveStyle({ maxWidth })
    expect(screen.getByTestId('container')).toHaveStyle({ alignSelf: 'center' })
  })

  it('renders fluid container', () => {
    render(
      <Container testID="container" variant="fluid">
        c
      </Container>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('container')).toHaveStyle({ width: '100%' })
  })

  it('renders narrow container', () => {
    render(
      <Container testID="container" variant="narrow">
        c
      </Container>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('container')).toHaveStyle({ maxWidth: 720 })
  })

  it('renders with as prop', () => {
    function Custom(props: { children: React.ReactNode }) {
      return <View {...props} testID="custom" />
    }
    render(
      <Container testID="container" as={Custom}>
        c
      </Container>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('custom')).toBeTruthy()
  })
})
