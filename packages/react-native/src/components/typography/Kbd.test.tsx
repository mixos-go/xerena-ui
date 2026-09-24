import { render, screen } from '@testing-library/react-native'
import { semantic } from '@xerena/tokens'
import { Provider } from '../../primitives/Provider'
import { Kbd } from './Kbd'

function wrapper(theme: { mode: 'light' | 'dark' } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Kbd', () => {
  it('renders with keyboard styling', () => {
    render(<Kbd testID="kbd">⌘K</Kbd>, { wrapper: wrapper() })
    expect(screen.getByTestId('kbd')).toHaveStyle({ backgroundColor: semantic.color.surface })
    expect(screen.getByTestId('kbd')).toHaveStyle({ borderWidth: 1 })
  })
})
