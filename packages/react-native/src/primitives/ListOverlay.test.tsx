import { Text, View } from 'react-native'
import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { semantic, semanticDark } from '@xerena/tokens'
import { Provider } from './Provider'
import { Anchor } from './Anchor'
import { ListOverlay } from './ListOverlay'

jest.mock('../hooks/useReducedMotion', () => ({
  useReducedMotion: jest.fn(() => false),
}))

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

  const makeAnchor = (overrides?: Partial<ReturnType<typeof jest.fn>>) => ({
    x: 0,
    y: 0,
    width: 200,
    height: 40,
    open: true,
    setOpen: jest.fn(),
    triggerRef: { current: null },
    ...overrides,
  })

  it('renders options when open', () => {
    const anchor = makeAnchor()
    render(
      <Provider theme={{ mode: 'light' }}>
        <ListOverlay open onClose={jest.fn()} anchor={anchor} options={options} onSelect={jest.fn()} />
      </Provider>,
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
    const anchor = makeAnchor()
    render(
      <Provider theme={{ mode: 'light' }}>
        <ListOverlay open onClose={onClose} anchor={anchor} options={options} onSelect={onSelect} />
      </Provider>,
    )
    act(() => {
      jest.runAllTimers()
    })
    fireEvent.press(screen.getByText('Banana'))
    expect(onSelect).toHaveBeenCalledWith('b')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders a custom option renderer', () => {
    const anchor = makeAnchor()
    render(
      <Provider theme={{ mode: 'light' }}>
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
        />
      </Provider>,
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
      <Provider theme={{ mode: 'light' }}>
        <ListOverlay open onClose={jest.fn()} anchor={anchor} options={options} />
      </Provider>,
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
      <Provider theme={{ mode: 'light' }}>
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
        </Anchor>
      </Provider>,
    )
    expect(screen.queryByText('Apple')).toBeNull()
    fireEvent.press(screen.getByTestId('trigger'))
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.getByText('Apple')).toBeDefined()
  })

  it('resolves light-mode surface colors from semantic palette', () => {
    const anchor = makeAnchor()
    render(
      <Provider theme={{ mode: 'light' }}>
        <ListOverlay open onClose={jest.fn()} anchor={anchor} options={options} />
      </Provider>,
    )
    act(() => {
      jest.runAllTimers()
    })
    const menu = screen.UNSAFE_getByProps({ accessibilityRole: 'menu' })
    expect(menu.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: semantic.color.background }),
        expect.objectContaining({ borderColor: semantic.color.border }),
      ]),
    )
  })

  it('resolves dark-mode surface colors from semanticDark palette', () => {
    const anchor = makeAnchor()
    render(
      <Provider theme={{ mode: 'dark' }}>
        <ListOverlay open onClose={jest.fn()} anchor={anchor} options={options} />
      </Provider>,
    )
    act(() => {
      jest.runAllTimers()
    })
    const menu = screen.UNSAFE_getByProps({ accessibilityRole: 'menu' })
    expect(menu.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: semanticDark.color.background }),
        expect.objectContaining({ borderColor: semanticDark.color.border }),
      ]),
    )
  })

  it('respects semantic overrides for surface colors', () => {
    const anchor = makeAnchor()
    render(
      <Provider theme={{ mode: 'light', semantic: { background: '#ff0000', border: '#00ff00' } }}>
        <ListOverlay open onClose={jest.fn()} anchor={anchor} options={options} />
      </Provider>,
    )
    act(() => {
      jest.runAllTimers()
    })
    const menu = screen.UNSAFE_getByProps({ accessibilityRole: 'menu' })
    expect(menu.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#ff0000' }),
        expect.objectContaining({ borderColor: '#00ff00' }),
      ]),
    )
  })
})
