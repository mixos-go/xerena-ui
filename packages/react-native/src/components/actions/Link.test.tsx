import { render, screen } from '@testing-library/react-native'
import { semantic, semanticDark } from '@xerena/tokens'
import { Provider } from '../../primitives/Provider'
import { Link } from './Link'

function wrapper(theme: { mode: 'light' | 'dark' } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Link', () => {
  it('renders default variant with link role', () => {
    render(<Link testID="link" href="/p">Page</Link>, { wrapper: wrapper() })
    const link = screen.getByTestId('link')
    expect(link.props.accessibilityRole).toBe('link')
    expect(link).toHaveStyle({ color: semantic.color.primary })
  })

  it('applies muted variant', () => {
    render(<Link testID="link" variant="muted">Muted</Link>, { wrapper: wrapper() })
    expect(screen.getByTestId('link')).toHaveStyle({ color: semantic.color.textMuted })
  })

  it('applies animated variant underline', () => {
    render(<Link testID="link" variant="animated">Animated</Link>, { wrapper: wrapper() })
    expect(screen.getByTestId('link')).toHaveStyle({ color: semantic.color.primary })
    expect(screen.getByTestId('link')).toHaveStyle({ borderBottomWidth: 1 })
  })

  it('ignores web-only target and rel without crashing', () => {
    render(
      <Link testID="link" href="/e" target="_blank" rel="noopener noreferrer">
        ext
      </Link>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('link')).toBeTruthy()
  })

  it('renders correctly in dark mode', () => {
    render(
      <Link testID="link" variant="default">
        Dark
      </Link>,
      { wrapper: wrapper({ mode: 'dark' }) },
    )
    expect(screen.getByTestId('link')).toHaveStyle({ color: semanticDark.color.primary })
  })
})
