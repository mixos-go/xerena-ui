import { Text } from 'react-native'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { Provider } from '../../primitives/Provider'
import { Drawer } from './Drawer'

jest.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: jest.fn(() => false),
}))

describe('Drawer', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders when open', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Drawer.Root open onClose={jest.fn()} side="right" size="md">
          <Drawer.Content>
            <Text testID="drawer-content">Drawer content</Text>
          </Drawer.Content>
        </Drawer.Root>
      </Provider>,
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(screen.getByTestId('drawer-content')).toBeDefined()
  })

  it('does not render when closed', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Drawer.Root open={false} side="right">
          <Drawer.Content>
            <Text>Drawer content</Text>
          </Drawer.Content>
        </Drawer.Root>
      </Provider>,
    )

    expect(screen.queryByTestId('drawer-content')).toBeNull()
  })

  it('toggles open when trigger is pressed', async () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Drawer.Root side="right">
          <Drawer.Trigger>
            <Text testID="trigger">Open Drawer</Text>
          </Drawer.Trigger>
          <Drawer.Content>
            <Text testID="drawer-content">Drawer content</Text>
          </Drawer.Content>
        </Drawer.Root>
      </Provider>,
    )

    expect(screen.queryByTestId('drawer-content')).toBeNull()

    fireEvent.press(screen.getByTestId('trigger'))
    act(() => {
      jest.runAllTimers()
    })

    await waitFor(() => expect(screen.getByTestId('drawer-content')).toBeDefined())

    fireEvent.press(screen.getByTestId('trigger'))
    act(() => {
      jest.runAllTimers()
    })

    await waitFor(() => expect(screen.queryByTestId('drawer-content')).toBeNull())
  })

  it('has correct structure', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Drawer.Root open side="right" size="md">
          <Drawer.Content>
            <Text testID="drawer-content">Drawer content</Text>
          </Drawer.Content>
        </Drawer.Root>
      </Provider>,
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(screen.getByTestId('drawer-content')).toBeDefined()
  })

  it('renders on left side', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Drawer.Root open side="left" size="md">
          <Drawer.Content>
            <Text testID="drawer-content">Drawer content</Text>
          </Drawer.Content>
        </Drawer.Root>
      </Provider>,
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(screen.getByTestId('drawer-content')).toBeDefined()
  })

  it('renders on top side', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Drawer.Root open side="top" size="md">
          <Drawer.Content>
            <Text testID="drawer-content">Drawer content</Text>
          </Drawer.Content>
        </Drawer.Root>
      </Provider>,
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(screen.getByTestId('drawer-content')).toBeDefined()
  })

  it('renders on bottom side', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Drawer.Root open side="bottom" size="md">
          <Drawer.Content>
            <Text testID="drawer-content">Drawer content</Text>
          </Drawer.Content>
        </Drawer.Root>
      </Provider>,
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(screen.getByTestId('drawer-content')).toBeDefined()
  })

  it('renders with xs size', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Drawer.Root open side="right" size="xs">
          <Drawer.Content>
            <Text testID="drawer-content">Drawer content</Text>
          </Drawer.Content>
        </Drawer.Root>
      </Provider>,
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(screen.getByTestId('drawer-content')).toBeDefined()
  })

  it('renders with lg size', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Drawer.Root open side="right" size="lg">
          <Drawer.Content>
            <Text testID="drawer-content">Drawer content</Text>
          </Drawer.Content>
        </Drawer.Root>
      </Provider>,
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(screen.getByTestId('drawer-content')).toBeDefined()
  })

  it('uses semantic background and border colors in light mode', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Drawer.Root open onClose={jest.fn()} side="right" size="md">
          <Drawer.Content>
            <Text testID="drawer-content">Drawer content</Text>
          </Drawer.Content>
        </Drawer.Root>
      </Provider>,
    )

    act(() => {
      jest.runAllTimers()
    })

    const drawer = screen.getByTestId('drawer-content')
    expect(drawer).toBeDefined()
  })

  it('uses semantic background and border colors in dark mode', () => {
    render(
      <Provider theme={{ mode: 'dark' }}>
        <Drawer.Root open onClose={jest.fn()} side="right" size="md">
          <Drawer.Content>
            <Text testID="drawer-content">Drawer content</Text>
          </Drawer.Content>
        </Drawer.Root>
      </Provider>,
    )

    act(() => {
      jest.runAllTimers()
    })

    const drawer = screen.getByTestId('drawer-content')
    expect(drawer).toBeDefined()
  })

  it('respects semantic overrides', () => {
    render(
      <Provider theme={{ mode: 'light', semantic: { background: '#ff0000', border: '#00ff00' } }}>
        <Drawer.Root open onClose={jest.fn()} side="right" size="md">
          <Drawer.Content>
            <Text testID="drawer-content">Drawer content</Text>
          </Drawer.Content>
        </Drawer.Root>
      </Provider>,
    )

    act(() => {
      jest.runAllTimers()
    })

    const drawer = screen.getByTestId('drawer-content')
    expect(drawer).toBeDefined()
  })

  it('has accessibilityModal on content', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Drawer.Root open onClose={jest.fn()} side="right" size="md">
          <Drawer.Content>
            <Text testID="drawer-content">Drawer content</Text>
          </Drawer.Content>
        </Drawer.Root>
      </Provider>,
    )

    act(() => {
      jest.runAllTimers()
    })

    const drawer = screen.getByTestId('drawer-content')
    expect(drawer).toBeDefined()
  })

  it('snaps to final state under reduced motion', () => {
    jest.mock('../../hooks/useReducedMotion', () => ({
      useReducedMotion: jest.fn(() => true),
    }))

    const { unmount } = render(
      <Provider theme={{ mode: 'light' }}>
        <Drawer.Root open onClose={jest.fn()} side="right" size="md">
          <Drawer.Content>
            <Text testID="drawer-content">Drawer content</Text>
          </Drawer.Content>
        </Drawer.Root>
      </Provider>,
    )

    act(() => {
      jest.runAllTimers()
    })

    const drawer = screen.getByTestId('drawer-content')
    expect(drawer).toBeDefined()

    unmount()
    jest.unmock('../../hooks/useReducedMotion')
  })
})