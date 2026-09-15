import { Text } from 'react-native'
import { fireEvent, render, screen } from '@testing-library/react-native'
import { Pressable } from './Pressable'

describe('Pressable', () => {
  it('renders children', () => {
    render(
      <Pressable testID="pressable">
        <Text>press me</Text>
      </Pressable>,
    )
    expect(screen.getByText('press me')).toBeDefined()
  })

  it('calls onPress when pressed', () => {
    const onPress = jest.fn()
    render(
      <Pressable testID="pressable" onPress={onPress}>
        <Text>press me</Text>
      </Pressable>,
    )
    fireEvent.press(screen.getByTestId('pressable'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn()
    render(
      <Pressable testID="pressable" disabled onPress={onPress}>
        <Text>press me</Text>
      </Pressable>,
    )
    fireEvent.press(screen.getByTestId('pressable'))
    expect(onPress).not.toHaveBeenCalled()
  })

  it('does not call onPress when loading', () => {
    const onPress = jest.fn()
    render(
      <Pressable testID="pressable" loading onPress={onPress}>
        <Text>press me</Text>
      </Pressable>,
    )
    fireEvent.press(screen.getByTestId('pressable'))
    expect(onPress).not.toHaveBeenCalled()
  })

  it('exposes pressed state to children function', () => {
    render(
      <Pressable testID="pressable">
        {({ pressed }) => <Text testID="state">{pressed ? 'pressed' : 'idle'}</Text>}
      </Pressable>,
    )
    expect(screen.getByTestId('state').children[0]).toBe('idle')
  })
})
