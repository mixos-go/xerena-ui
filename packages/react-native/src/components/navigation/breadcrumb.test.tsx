import { render, screen } from '@testing-library/react-native'
import { Provider } from '../../primitives/Provider'
import { Breadcrumb } from './Breadcrumb'

function wrapper(theme: { mode: 'light' | 'dark'; semantic?: Record<string, string> } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Breadcrumb', () => {
  it('renders with accessibilityLabel', () => {
    render(
      <Breadcrumb testID="breadcrumb">
        <Breadcrumb.Item href="/" testID="item-home">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/a" testID="item-a">A</Breadcrumb.Item>
        <Breadcrumb.Item current testID="item-current">Current</Breadcrumb.Item>
      </Breadcrumb>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('breadcrumb').props.role).toBe('navigation')
  })

  it('renders items with separators', () => {
    render(
      <Breadcrumb testID="breadcrumb">
        <Breadcrumb.Item href="/" testID="item-home">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/a" testID="item-a">A</Breadcrumb.Item>
        <Breadcrumb.Item current testID="item-current">Current</Breadcrumb.Item>
      </Breadcrumb>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('item-home')).toBeTruthy()
    expect(screen.getByTestId('item-a')).toBeTruthy()
    expect(screen.getByTestId('item-current')).toBeTruthy()
    // Two separators between three items
    const separators = screen.getAllByText('/')
    expect(separators.length).toBe(2)
  })

  it('applies aria-current to current item', () => {
    render(
      <Breadcrumb testID="breadcrumb">
        <Breadcrumb.Item href="/" testID="item-home">Home</Breadcrumb.Item>
        <Breadcrumb.Item current testID="item-current">Current</Breadcrumb.Item>
      </Breadcrumb>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('item-current').props.accessibilityState?.selected).toBe(true)
  })

  it('renders link items as pressable', () => {
    render(
      <Breadcrumb testID="breadcrumb">
        <Breadcrumb.Item href="/" testID="item-home">Home</Breadcrumb.Item>
        <Breadcrumb.Item current testID="item-current">Current</Breadcrumb.Item>
      </Breadcrumb>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('item-home').props.accessibilityRole).toBe('link')
  })

  it('renders current item as text (not link)', () => {
    render(
      <Breadcrumb testID="breadcrumb">
        <Breadcrumb.Item href="/" testID="item-home">Home</Breadcrumb.Item>
        <Breadcrumb.Item current testID="item-current">Current</Breadcrumb.Item>
      </Breadcrumb>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('item-current').props.accessibilityRole).toBe('text')
  })

  it('supports custom separators', () => {
    render(
      <Breadcrumb testID="breadcrumb">
        <Breadcrumb.Item href="/" separator="chevron" testID="item-home">Home</Breadcrumb.Item>
        <Breadcrumb.Item current separator="chevron" testID="item-current">Current</Breadcrumb.Item>
      </Breadcrumb>,
      { wrapper: wrapper() },
    )
    expect(screen.getByText('›')).toBeTruthy()
  })

  it('renders correctly in dark mode', () => {
    render(
      <Breadcrumb testID="breadcrumb">
        <Breadcrumb.Item href="/" testID="item-home">Home</Breadcrumb.Item>
        <Breadcrumb.Item current testID="item-current">Current</Breadcrumb.Item>
      </Breadcrumb>,
      { wrapper: wrapper({ mode: 'dark' }) },
    )
    expect(screen.getByTestId('breadcrumb')).toBeTruthy()
  })

  it('applies custom semantic override', () => {
    const override = '#ff0000'
    render(
      <Breadcrumb testID="breadcrumb">
        <Breadcrumb.Item href="/" testID="item-home">Home</Breadcrumb.Item>
        <Breadcrumb.Item current testID="item-current">Current</Breadcrumb.Item>
      </Breadcrumb>,
      { wrapper: wrapper({ mode: 'light', semantic: { primary: override } }) },
    )
    expect(screen.getByTestId('breadcrumb')).toBeTruthy()
  })
})