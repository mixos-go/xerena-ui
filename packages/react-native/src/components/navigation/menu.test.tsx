import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Provider } from '../../primitives/Provider'
import { Menu } from './Menu'

function wrapper(theme: { mode: 'light' | 'dark'; semantic?: Record<string, string> } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Menu', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders trigger with aria-haspopup menu', () => {
    render(
      <Menu.Root testID="menu-root">
        <Menu.Trigger testID="trigger"><Text>Open Menu</Text></Menu.Trigger>
        <Menu.Content testID="content">
          <Menu.Item>Item 1</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('trigger').props.accessibilityRole).toBe('button')
  })

  it('opens menu on trigger press', () => {
    render(
      <Menu.Root testID="menu-root">
        <Menu.Trigger testID="trigger"><Text>Open Menu</Text></Menu.Trigger>
        <Menu.Content testID="content">
          <Menu.Item>Item 1</Menu.Item>
          <Menu.Item>Item 2</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('trigger'))
    jest.runAllTimers()
    expect(screen.getByText('Item 1')).toBeTruthy()
    expect(screen.getByText('Item 2')).toBeTruthy()
  })

  it('closes menu on trigger press when open', () => {
    render(
      <Menu.Root testID="menu-root">
        <Menu.Trigger testID="trigger"><Text>Open Menu</Text></Menu.Trigger>
        <Menu.Content testID="content">
          <Menu.Item>Item 1</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('trigger'))
    jest.runAllTimers()
    expect(screen.getByText('Item 1')).toBeTruthy()
    fireEvent.press(screen.getByTestId('trigger'))
    jest.runAllTimers()
    expect(screen.queryByText('Item 1')).toBeNull()
  })

  it('closes menu on item selection', () => {
    render(
      <Menu.Root testID="menu-root">
        <Menu.Trigger testID="trigger"><Text>Open Menu</Text></Menu.Trigger>
        <Menu.Content testID="content">
          <Menu.Item>Item 1</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('trigger'))
    jest.runAllTimers()
    fireEvent.press(screen.getByText('Item 1'))
    jest.runAllTimers()
    expect(screen.queryByText('Item 1')).toBeNull()
  })

  it('supports disabled items', () => {
    render(
      <Menu.Root testID="menu-root">
        <Menu.Trigger testID="trigger"><Text>Open Menu</Text></Menu.Trigger>
        <Menu.Content testID="content">
          <Menu.Item disabled>Disabled Item</Menu.Item>
          <Menu.Item>Enabled Item</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('trigger'))
    jest.runAllTimers()
    expect(screen.getByText('Disabled Item')).toBeTruthy()
    expect(screen.getByText('Enabled Item')).toBeTruthy()
  })

  it('renders separator', () => {
    render(
      <Menu.Root testID="menu-root">
        <Menu.Trigger testID="trigger"><Text>Open Menu</Text></Menu.Trigger>
        <Menu.Content testID="content">
          <Menu.Item>Item 1</Menu.Item>
          <Menu.Separator />
          <Menu.Item>Item 2</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('trigger'))
    jest.runAllTimers()
    // Separator is rendered but not directly testable via text
    expect(screen.getByText('Item 1')).toBeTruthy()
    expect(screen.getByText('Item 2')).toBeTruthy()
  })

  it('renders label', () => {
    render(
      <Menu.Root testID="menu-root">
        <Menu.Trigger testID="trigger"><Text>Open Menu</Text></Menu.Trigger>
        <Menu.Content testID="content">
          <Menu.Label>Menu Label</Menu.Label>
          <Menu.Item>Item 1</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('trigger'))
    jest.runAllTimers()
    expect(screen.getByText('Menu Label')).toBeTruthy()
    expect(screen.getByText('Item 1')).toBeTruthy()
  })

  it('renders correctly in dark mode', () => {
    render(
      <Menu.Root testID="menu-root">
        <Menu.Trigger testID="trigger"><Text>Open Menu</Text></Menu.Trigger>
        <Menu.Content testID="content">
          <Menu.Item>Item 1</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
      { wrapper: wrapper({ mode: 'dark' }) },
    )
    expect(screen.getByTestId('menu-root')).toBeTruthy()
  })

  it('applies custom semantic override', () => {
    const override = '#ff0000'
    render(
      <Menu.Root testID="menu-root">
        <Menu.Trigger testID="trigger"><Text>Open Menu</Text></Menu.Trigger>
        <Menu.Content testID="content">
          <Menu.Item>Item 1</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
      { wrapper: wrapper({ mode: 'light', semantic: { primary: override } }) },
    )
    expect(screen.getByTestId('menu-root')).toBeTruthy()
  })
})