import { Text } from 'react-native'
import { act, render, screen } from '@testing-library/react-native'
import { Provider } from '../../primitives/Provider'
import { Tooltip } from './Tooltip'

jest.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: jest.fn(() => false),
}))

describe('Tooltip', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders trigger', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Tooltip content="Tooltip text">
          <Text testID="trigger">Hover me</Text>
        </Tooltip>
      </Provider>,
    )

    expect(screen.getByTestId('trigger')).toBeDefined()
  })

  it('has correct structure', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Tooltip content="Tooltip text" delay={0}>
          <Text testID="trigger">Hover me</Text>
        </Tooltip>
      </Provider>,
    )

    act(() => {
      jest.runAllTimers()
    })

    // Verify the component structure renders
    expect(screen.getByTestId('trigger')).toBeDefined()
  })
})