import { render, screen } from '@testing-library/react-native'
import { Provider } from '../../primitives/Provider'
import { Divider } from './Divider'

function wrapper(theme: { mode: 'light' | 'dark' } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Divider', () => {
  it('renders horizontal divider', () => {
    render(<Divider testID="divider" />, { wrapper: wrapper() })
    expect(screen.getByTestId('divider')).toBeTruthy()
  })

  it('renders vertical divider', () => {
    render(<Divider testID="divider" orientation="vertical" />, { wrapper: wrapper() })
    expect(screen.getByTestId('divider')).toHaveStyle({ width: 1, height: '100%' })
  })

  it('renders dashed variant', () => {
    render(<Divider testID="divider" variant="dashed" />, { wrapper: wrapper() })
    expect(screen.getByTestId('divider')).toHaveStyle({ borderStyle: 'dashed' })
  })

  it('renders label divider', () => {
    render(<Divider testID="divider" label="or" />, { wrapper: wrapper() })
    expect(screen.getByText('or')).toBeTruthy()
  })
})
