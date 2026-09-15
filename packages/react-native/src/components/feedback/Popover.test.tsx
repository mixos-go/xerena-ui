import { Text } from 'react-native'
import { act, render, screen } from '@testing-library/react-native'
import { Provider } from '../../primitives/Provider'
import { Popover } from './Popover'

jest.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: jest.fn(() => false),
}))

describe('Popover', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders trigger when open', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Popover.Root open={true}>
          <Popover.Trigger>
            <Text testID="trigger">Open Popover</Text>
          </Popover.Trigger>
          <Popover.Content>
            <Text testID="popover-content">Popover content</Text>
          </Popover.Content>
        </Popover.Root>
      </Provider>,
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(screen.getByTestId('trigger')).toBeDefined()
  })

  it('does not render content when closed', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Popover.Root open={false}>
          <Popover.Trigger>
            <Text testID="trigger">Open Popover</Text>
          </Popover.Trigger>
          <Popover.Content>
            <Text testID="popover-content">Popover content</Text>
          </Popover.Content>
        </Popover.Root>
      </Provider>,
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(screen.queryByTestId('popover-content')).toBeNull()
  })

  it('has correct structure', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Popover.Root open={true}>
          <Popover.Trigger>
            <Text testID="trigger">Open Popover</Text>
          </Popover.Trigger>
          <Popover.Content>
            <Text testID="popover-content">Popover content</Text>
          </Popover.Content>
        </Popover.Root>
      </Provider>,
    )

    act(() => {
      jest.runAllTimers()
    })

    // Verify the component structure renders
    expect(screen.getByTestId('trigger')).toBeDefined()
  })
})