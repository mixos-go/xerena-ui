import { Text } from 'react-native'
import { fireEvent, render, screen } from '@testing-library/react-native'
import { semantic, semanticDark } from '@xerena/tokens'
import { Provider } from '../../primitives/Provider'
import { Avatar } from './Avatar'

function wrapper(theme: { mode: 'light' | 'dark' } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Avatar', () => {
  it('renders initials fallback', () => {
    render(<Avatar testID="avatar" variant="initials" initials="AB" />, { wrapper: wrapper() })
    expect(screen.getByText('AB')).toBeTruthy()
    expect(screen.getByTestId('avatar')).toHaveStyle({ width: 40, height: 40 })
  })

  it('applies size and shape', () => {
    render(<Avatar testID="avatar" variant="initials" initials="X" size="xl" shape="square" />, { wrapper: wrapper() })
    expect(screen.getByTestId('avatar')).toHaveStyle({ width: 80, height: 80 })
    expect(screen.getByTestId('avatar')).toHaveStyle({ borderRadius: 8 })
  })

  it('renders circle shape', () => {
    render(<Avatar testID="avatar" variant="initials" initials="C" shape="circle" />, { wrapper: wrapper() })
    expect(screen.getByTestId('avatar')).toHaveStyle({ borderRadius: 9999 })
  })

  it('renders icon variant', () => {
    render(
      <Avatar testID="avatar" variant="icon" icon={<Text testID="icon">★</Text>} />,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('icon')).toBeTruthy()
  })

  it('calls onPress and exposes button role', () => {
    const onPress = jest.fn()
    render(<Avatar testID="avatar" variant="initials" initials="P" onPress={onPress} />, { wrapper: wrapper() })
    fireEvent.press(screen.getByTestId('avatar'))
    expect(onPress).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('avatar').props.accessibilityRole).toBe('button')
  })

  it('renders correctly in dark mode', () => {
    render(<Avatar testID="avatar" variant="initials" initials="D" />, { wrapper: wrapper({ mode: 'dark' }) })
    expect(screen.getByTestId('avatar')).toHaveStyle({ backgroundColor: semanticDark.color.surface })
  })
})
