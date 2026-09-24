import { fireEvent, render, screen } from '@testing-library/react-native'
import { Modal, Pressable, Text } from 'react-native'
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

  it('calls onSelect when an item is pressed', () => {
    const onSelect = jest.fn()
    render(
      <Menu.Root testID="menu-root">
        <Menu.Trigger testID="trigger"><Text>Open Menu</Text></Menu.Trigger>
        <Menu.Content testID="content">
          <Menu.Item onSelect={onSelect}>Item 1</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('trigger'))
    jest.runAllTimers()
    fireEvent.press(screen.getByText('Item 1'))
    jest.runAllTimers()
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Item 1')).toBeNull()
  })

  it('does not call onSelect for disabled items', () => {
    const onSelect = jest.fn()
    render(
      <Menu.Root testID="menu-root">
        <Menu.Trigger testID="trigger"><Text>Open Menu</Text></Menu.Trigger>
        <Menu.Content testID="content">
          <Menu.Item disabled onSelect={onSelect}>Disabled Item</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('trigger'))
    jest.runAllTimers()
    expect(screen.getByText('Disabled Item')).toBeTruthy()
    fireEvent.press(screen.getByText('Disabled Item'))
    jest.runAllTimers()
    expect(onSelect).not.toHaveBeenCalled()
    expect(screen.getByText('Disabled Item')).toBeTruthy()
  })

  it('renders separator', () => {
    render(
      <Menu.Root testID="menu-root">
        <Menu.Trigger testID="trigger"><Text>Open Menu</Text></Menu.Trigger>
        <Menu.Content testID="content">
          <Menu.Item>Item 1</Menu.Item>
          <Menu.Separator testID="sep" />
          <Menu.Item>Item 2</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('trigger'))
    jest.runAllTimers()
    expect(screen.getByText('Item 1')).toBeTruthy()
    expect(screen.getByTestId('sep').props.role).toBe('separator')
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

  it('dismisses on back button via onRequestClose', () => {
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
    const modal = screen.UNSAFE_getByType(Modal)
    expect(typeof modal.props.onRequestClose).toBe('function')
    fireEvent(modal, 'requestClose')
    jest.runAllTimers()
    expect(screen.queryByText('Item 1')).toBeNull()
  })

  it('dismisses on outside backdrop press', () => {
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
    const backdrop = screen.UNSAFE_getAllByType(Pressable).find(
      (node) => typeof node.props.onResponderRelease === 'function',
    )
    expect(backdrop).toBeTruthy()
    fireEvent(backdrop, 'responderRelease')
    jest.runAllTimers()
    expect(screen.queryByText('Item 1')).toBeNull()
  })

  it('sets accessibilityViewIsModal on overlay content', () => {
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
    expect(screen.UNSAFE_getByProps({ accessibilityViewIsModal: true })).toBeTruthy()
  })

  it('renders correctly in dark mode', () => {    render(
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