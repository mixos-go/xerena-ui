import { fireEvent, render, screen } from '@testing-library/react-native'
import { Provider } from '../../primitives/Provider'
import { Tabs } from './Tabs'

function wrapper(theme: { mode: 'light' | 'dark'; semantic?: Record<string, string> } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Tabs', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('renders tablist with tabs and panels', () => {
    render(
      <Tabs.Root defaultValue="a" testID="tabs-root">
        <Tabs.List>
          <Tabs.Trigger value="a" testID="tab-a">Tab A</Tabs.Trigger>
          <Tabs.Trigger value="b" testID="tab-b">Tab B</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="a" testID="panel-a">Content A</Tabs.Panel>
        <Tabs.Panel value="b" testID="panel-b">Content B</Tabs.Panel>
      </Tabs.Root>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('tabs-root')).toBeTruthy()
    expect(screen.getByTestId('tab-a').props.accessibilityState?.selected).toBe(true)
    expect(screen.getByTestId('tab-b').props.accessibilityState?.selected).toBe(false)
    expect(screen.getByTestId('panel-a')).toBeTruthy()
    expect(screen.queryByTestId('panel-b')).toBeNull()
  })

  it('switches tabs on trigger press', () => {
    render(
      <Tabs.Root defaultValue="a" testID="tabs-root">
        <Tabs.List>
          <Tabs.Trigger value="a" testID="tab-a">Tab A</Tabs.Trigger>
          <Tabs.Trigger value="b" testID="tab-b">Tab B</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="a" testID="panel-a">Content A</Tabs.Panel>
        <Tabs.Panel value="b" testID="panel-b">Content B</Tabs.Panel>
      </Tabs.Root>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('tab-b'))
    expect(screen.getByTestId('tab-a').props.accessibilityState?.selected).toBe(false)
    expect(screen.getByTestId('tab-b').props.accessibilityState?.selected).toBe(true)
    expect(screen.queryByTestId('panel-a')).toBeNull()
    expect(screen.getByTestId('panel-b')).toBeTruthy()
  })

  it('supports controlled value via value/onValueChange', () => {
    const onValueChange = jest.fn()
    render(
      <Tabs.Root value="a" onValueChange={onValueChange} testID="tabs-root">
        <Tabs.List>
          <Tabs.Trigger value="a" testID="tab-a">Tab A</Tabs.Trigger>
          <Tabs.Trigger value="b" testID="tab-b">Tab B</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="a" testID="panel-a">Content A</Tabs.Panel>
        <Tabs.Panel value="b" testID="panel-b">Content B</Tabs.Panel>
      </Tabs.Root>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('tab-b'))
    expect(onValueChange).toHaveBeenCalledWith('b')
  })

  it('supports disabled triggers', () => {
    render(
      <Tabs.Root defaultValue="a" testID="tabs-root">
        <Tabs.List>
          <Tabs.Trigger value="a" testID="tab-a">Tab A</Tabs.Trigger>
          <Tabs.Trigger value="b" testID="tab-b" disabled>Tab B</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="a" testID="panel-a">Content A</Tabs.Panel>
        <Tabs.Panel value="b" testID="panel-b">Content B</Tabs.Panel>
      </Tabs.Root>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('tab-b').props.accessibilityState?.disabled).toBe(true)
    fireEvent.press(screen.getByTestId('tab-b'))
    expect(screen.getByTestId('tab-a').props.accessibilityState?.selected).toBe(true)
  })

  it('renders animated indicator', () => {
    render(
      <Tabs.Root defaultValue="a" testID="tabs-root">
        <Tabs.List testID="tabs-list">
          <Tabs.Trigger value="a" testID="tab-a">Tab A</Tabs.Trigger>
          <Tabs.Trigger value="b" testID="tab-b">Tab B</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="a" testID="panel-a">Content A</Tabs.Panel>
      </Tabs.Root>,
      { wrapper: wrapper() },
    )
    // Indicator is internal, verify tab list renders
    expect(screen.getByTestId('tabs-list')).toBeTruthy()
  })

  it('renders correctly in dark mode', () => {
    render(
      <Tabs.Root defaultValue="a" testID="tabs-root">
        <Tabs.List>
          <Tabs.Trigger value="a" testID="tab-a">Tab A</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="a" testID="panel-a">Content A</Tabs.Panel>
      </Tabs.Root>,
      { wrapper: wrapper({ mode: 'dark' }) },
    )
    expect(screen.getByTestId('tabs-root')).toBeTruthy()
  })

  it('applies custom semantic override', () => {
    const override = '#ff0000'
    render(
      <Tabs.Root defaultValue="a" testID="tabs-root">
        <Tabs.List>
          <Tabs.Trigger value="a" testID="tab-a">Tab A</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="a" testID="panel-a">Content A</Tabs.Panel>
      </Tabs.Root>,
      { wrapper: wrapper({ mode: 'light', semantic: { primary: override } }) },
    )
    expect(screen.getByTestId('tabs-root')).toBeTruthy()
  })
})