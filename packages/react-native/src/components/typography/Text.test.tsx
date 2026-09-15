import { Text as RNText } from 'react-native'
import { render, screen } from '@testing-library/react-native'
import { semantic, semanticDark } from '@xerena/tokens'
import { Provider } from '../../primitives/Provider'
import { Text } from './Text'

function wrapper(theme: { mode: 'light' | 'dark'; semantic?: Record<string, string> } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Text', () => {
  it('renders body variant by default', () => {
    render(<Text testID="text">hello</Text>, { wrapper: wrapper() })
    const el = screen.getByTestId('text')
    expect(el).toHaveStyle({ color: semantic.color.text })
  })

  it('applies muted variant', () => {
    render(<Text testID="text" variant="muted">muted</Text>, { wrapper: wrapper() })
    expect(screen.getByTestId('text')).toHaveStyle({ color: semantic.color.textMuted })
  })

  it('applies error variant', () => {
    render(<Text testID="text" variant="error">err</Text>, { wrapper: wrapper() })
    expect(screen.getByTestId('text')).toHaveStyle({ color: semantic.color.dangerText })
  })

  it('applies strong variant', () => {
    render(<Text testID="text" variant="strong">strong</Text>, { wrapper: wrapper() })
    expect(screen.getByTestId('text')).toHaveStyle({ fontWeight: '700' })
  })

  it('applies mono font', () => {
    render(<Text testID="text" font="mono">mono</Text>, { wrapper: wrapper() })
    expect(screen.getByTestId('text')).toHaveStyle({ fontFamily: 'Geist Mono, ui-monospace, monospace' })
  })

  it('truncates text', () => {
    render(<Text testID="text" truncate>long text</Text>, { wrapper: wrapper() })
    expect(screen.getByTestId('text').props.numberOfLines).toBe(1)
  })

  it('centers text', () => {
    render(<Text testID="text" center>center</Text>, { wrapper: wrapper() })
    expect(screen.getByTestId('text')).toHaveStyle({ textAlign: 'center' })
  })

  it('renders with as prop', () => {
    function Custom(props: { children: React.ReactNode }) {
      return <RNText {...props} testID="custom" />
    }
    render(
      <Text as={Custom} testID="text">
        custom
      </Text>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('custom')).toBeTruthy()
  })

  it('renders correctly in dark mode', () => {
    render(<Text testID="text">dark</Text>, { wrapper: wrapper({ mode: 'dark' }) })
    expect(screen.getByTestId('text')).toHaveStyle({ color: semanticDark.color.text })
  })
})
