import { Text, View } from 'react-native'
import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { Anchor } from './Anchor'
import { ListOverlay } from './ListOverlay'

describe('ListOverlay', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const options = [
    { value: 'a', label: 'Apple' },
    { value: 'b', label: 'Banana' },
    { value: 'c', label: 'Cherry' },
  ]

  it('renders options when open', () => {
    const anchor = { x: 0, y: 0, width: 200, height: 40, open: true, setOpen: jest.fn(), triggerRef: { current: null } }
    render(
      <ListOverlay open onClose={jest.fn()} anchor={anchor} options={options} onSelect={jest.fn()} />,
    )
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.getByText('Apple')).toBeDefined()
    expect(screen.getByText('Banana')).toBeDefined()
    expect(screen.getByText('Cherry')).toBeDefined()
  })

  it('calls onSelect and onClose when an option is pressed', () => {
    const onSelect = jest.fn()
    const onClose = jest.fn()
    const anchor = { x: 0, y: 0, width: 200, height: 40, open: true, setOpen: jest.fn(), triggerRef: { current: null } }
    render(
      <ListOverlay open onClose={onClose} anchor={anchor} options={options} onSelect={onSelect} />,
    )
    act(() => {
      jest.runAllTimers()
    })
    fireEvent.press(screen.getByText('Banana'))
    expect(onSelect).toHaveBeenCalledWith('b')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders a custom option renderer', () => {
    const anchor = { x: 0, y: 0, width: 200, height: 40, open: true, setOpen: jest.fn(), triggerRef: { current: null } }
    render(
      <ListOverlay
        open
        onClose={jest.fn()}
        anchor={anchor}
        options={options}
        selected="a"
        renderOption={(item, { selected }) => (
          <View>
            <Text>{`${item.label}${selected ? '*' : ''}`}</Text>
          </View>
        )}
      />,
    )
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.getByText('Apple*')).toBeDefined()
    expect(screen.getByText('Banana')).toBeDefined()
  })

  it('positions anchored content relative to trigger geometry', () => {
    const anchor = { x: 24, y: 80, width: 200, height: 40, open: true, setOpen: jest.fn(), triggerRef: { current: null } }
    render(
      <ListOverlay open onClose={jest.fn()} anchor={anchor} options={options} />,
    )
    act(() => {
      jest.runAllTimers()
    })
    const menu = screen.UNSAFE_getByProps({ accessibilityRole: 'menu' })
    expect(menu.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ left: 24, top: 120, minWidth: 200 }),
      ]),
    )
  })

  it('composes with Anchor trigger geometry', () => {
    const onSelect = jest.fn()
    render(
      <Anchor>
        {({ x, y, width, height, open, setOpen, triggerRef }) => (
          <View ref={triggerRef}>
            <Text testID="trigger" onPress={() => setOpen(true)}>
              open
            </Text>
            <ListOverlay
              open={open}
              onClose={() => setOpen(false)}
              anchor={{ x, y, width, height, open, setOpen, triggerRef }}
              options={options}
              onSelect={onSelect}
            />
          </View>
        )}
      </Anchor>,
    )
    expect(screen.queryByText('Apple')).toBeNull()
    fireEvent.press(screen.getByTestId('trigger'))
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.getByText('Apple')).toBeDefined()
  })
})
