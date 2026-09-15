import { render, screen } from '@testing-library/react-native'
import { Provider } from '../../primitives/Provider'
import { Skeleton } from './Skeleton'

jest.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: jest.fn(),
}))

import { useReducedMotion as mockedUseReducedMotion } from '../../hooks/useReducedMotion'

const mockedReduced = mockedUseReducedMotion as jest.Mock

function wrapper(theme: { mode: 'light' | 'dark' } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Skeleton', () => {
  beforeEach(() => {
    mockedReduced.mockReturnValue(false)
  })

  afterEach(() => {
    mockedReduced.mockReset()
  })

  it('renders line skeleton with dimensions', () => {
    render(<Skeleton testID="skeleton" shape="line" width={100} height={12} />, { wrapper: wrapper() })
    expect(screen.getByTestId('skeleton')).toBeTruthy()
    expect(screen.getByTestId('skeleton')).toHaveStyle({ width: 100, height: 12 })
  })

  it('renders circle skeleton', () => {
    render(<Skeleton testID="skeleton" shape="circle" width={40} height={40} />, { wrapper: wrapper() })
    expect(screen.getByTestId('skeleton')).toHaveStyle({ borderRadius: 9999 })
  })

  it('falls back to static opacity when reduced motion is enabled', () => {
    mockedReduced.mockReturnValue(true)
    render(<Skeleton testID="skeleton" shape="line" width={100} height={12} />, { wrapper: wrapper() })
    expect(screen.getByTestId('skeleton')).toHaveStyle({ opacity: 0.4 })
  })
})
