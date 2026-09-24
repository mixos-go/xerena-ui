import { Text, View } from 'react-native'
import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { Anchor } from './Anchor'

describe('Anchor', () => {
  it('exposes default geometry before layout', () => {
    render(
      <Anchor>
        {({ x, y, width, height }) => (
          <View>
            <Text testID="geo">{`${x},${y},${width},${height}`}</Text>
          </View>
        )}
      </Anchor>,
    )
    expect(screen.getByTestId('geo').children[0]).toBe('0,0,0,0')
  })

  it('measures trigger via triggerRef.measureInWindow on layout', () => {
    let capturedRef: { current: View | null } = { current: null }

    render(
      <Anchor>
        {({ x, y, width, height, triggerRef }) => {
          capturedRef = triggerRef as { current: View | null }
          return (
            <View ref={triggerRef}>
              <Text testID="geo">{`${x},${y},${width},${height}`}</Text>
            </View>
          )
        }}
      </Anchor>,
    )

    expect(capturedRef.current).not.toBeNull()
    const measureSpy = jest
      .spyOn(capturedRef.current as unknown as { measureInWindow: (cb: (x: number, y: number, w: number, h: number) => void) => void }, 'measureInWindow')
      .mockImplementation((callback) => {
        callback(10, 20, 100, 40)
      })

    act(() => {
      fireEvent(screen.getByTestId('geo').parent as unknown as HTMLElement, 'layout', {
        nativeEvent: { layout: { x: 0, y: 0, width: 200, height: 40 } },
      })
    })

    expect(measureSpy).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('geo').children[0]).toBe('10,20,100,40')

    measureSpy.mockRestore()
  })

  it('toggles open state with setOpen', () => {
    render(
      <Anchor>
        {({ open, setOpen, triggerRef }) => (
          <View ref={triggerRef}>
            <Text testID="open">{open ? 'open' : 'closed'}</Text>
            <Text testID="toggle" onPress={() => setOpen(true)}>
              toggle
            </Text>
          </View>
        )}
      </Anchor>,
    )
    expect(screen.getByTestId('open').children[0]).toBe('closed')
    fireEvent.press(screen.getByTestId('toggle'))
    expect(screen.getByTestId('open').children[0]).toBe('open')
  })
})
