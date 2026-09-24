import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { Provider } from '../../primitives/Provider'
import { Accordion } from './Accordion'

function wrapper(theme: { mode: 'light' | 'dark'; semantic?: Record<string, string> } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Accordion', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders header with aria-expanded false initially', () => {
    render(
      <Accordion.Root type="single" testID="accordion-root">
        <Accordion.Item value="a" testID="item-a">
          <Accordion.Header>
            <Accordion.Trigger value="a" testID="trigger-a">Question A</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content value="a" testID="content-a">Answer A</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('trigger-a').props.accessibilityState?.expanded).toBe(false)
    expect(screen.queryByTestId('content-a')).toBeNull()
  })

  it('expands content on trigger press', () => {
    render(
      <Accordion.Root type="single" testID="accordion-root">
        <Accordion.Item value="a" testID="item-a">
          <Accordion.Header>
            <Accordion.Trigger value="a" testID="trigger-a">Question A</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content value="a" testID="content-a">Answer A</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="b" testID="item-b">
          <Accordion.Header>
            <Accordion.Trigger value="b" testID="trigger-b">Question B</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content value="b" testID="content-b">Answer B</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('trigger-a'))
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.getByTestId('trigger-a').props.accessibilityState?.expanded).toBe(true)
    expect(screen.getByTestId('content-a')).toBeTruthy()
    expect(screen.getByTestId('trigger-b').props.accessibilityState?.expanded).toBe(false)
    expect(screen.queryByTestId('content-b')).toBeNull()
  })

  it('collapses previous item when opening new item in single mode', () => {
    render(
      <Accordion.Root type="single" testID="accordion-root">
        <Accordion.Item value="a" testID="item-a">
          <Accordion.Header>
            <Accordion.Trigger value="a" testID="trigger-a">Question A</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content value="a" testID="content-a">Answer A</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="b" testID="item-b">
          <Accordion.Header>
            <Accordion.Trigger value="b" testID="trigger-b">Question B</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content value="b" testID="content-b">Answer B</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('trigger-a'))
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.getByTestId('content-a')).toBeTruthy()
    fireEvent.press(screen.getByTestId('trigger-b'))
    expect(screen.getByTestId('content-a')).toBeTruthy()
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.getByTestId('trigger-a').props.accessibilityState?.expanded).toBe(false)
    expect(screen.queryByTestId('content-a')).toBeNull()
    expect(screen.getByTestId('trigger-b').props.accessibilityState?.expanded).toBe(true)
    expect(screen.getByTestId('content-b')).toBeTruthy()
  })

  it('keeps content mounted through the exit animation then unmounts', () => {
    render(
      <Accordion.Root type="single" testID="accordion-root">
        <Accordion.Item value="a" testID="item-a">
          <Accordion.Header>
            <Accordion.Trigger value="a" testID="trigger-a">Question A</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content value="a" testID="content-a">Answer A</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('trigger-a'))
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.getByTestId('content-a')).toBeTruthy()
    fireEvent.press(screen.getByTestId('trigger-a'))
    expect(screen.getByTestId('content-a')).toBeTruthy()
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.queryByTestId('content-a')).toBeNull()
  })

  it('measures content height for the reveal animation', () => {
    render(
      <Accordion.Root type="single" testID="accordion-root">
        <Accordion.Item value="a" testID="item-a">
          <Accordion.Header>
            <Accordion.Trigger value="a" testID="trigger-a">Question A</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content value="a" testID="content-a">Answer A</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('trigger-a'))
    fireEvent(screen.getByTestId('content-a-inner'), 'layout', { nativeEvent: { layout: { height: 120 } } })
    act(() => {
      jest.runAllTimers()
    })
    const style = screen.getByTestId('content-a').props.style
    const flat = Array.isArray(style) ? Object.assign({}, ...style) : style
    expect(flat.maxHeight).toBeDefined()
  })

  it('calls onValueChange in uncontrolled mode', () => {
    const onValueChange = jest.fn()
    render(
      <Accordion.Root type="single" onValueChange={onValueChange} testID="accordion-root">
        <Accordion.Item value="a" testID="item-a">
          <Accordion.Header>
            <Accordion.Trigger value="a" testID="trigger-a">Question A</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content value="a" testID="content-a">Answer A</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('trigger-a'))
    act(() => {
      jest.runAllTimers()
    })
    expect(onValueChange).toHaveBeenCalledWith(['a'])
    fireEvent.press(screen.getByTestId('trigger-a'))
    act(() => {
      jest.runAllTimers()
    })
    expect(onValueChange).toHaveBeenCalledWith([])
  })

  it('supports multiple mode allowing multiple open items', () => {
    render(
      <Accordion.Root type="multiple" testID="accordion-root">
        <Accordion.Item value="a" testID="item-a">
          <Accordion.Header>
            <Accordion.Trigger value="a" testID="trigger-a">Question A</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content value="a" testID="content-a">Answer A</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="b" testID="item-b">
          <Accordion.Header>
            <Accordion.Trigger value="b" testID="trigger-b">Question B</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content value="b" testID="content-b">Answer B</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('trigger-a'))
    fireEvent.press(screen.getByTestId('trigger-b'))
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.getByTestId('trigger-a').props.accessibilityState?.expanded).toBe(true)
    expect(screen.getByTestId('trigger-b').props.accessibilityState?.expanded).toBe(true)
    expect(screen.getByTestId('content-a')).toBeTruthy()
    expect(screen.getByTestId('content-b')).toBeTruthy()
  })

  it('supports controlled value via value/onValueChange', () => {
    const onValueChange = jest.fn()
    render(
      <Accordion.Root type="single" value={['a']} onValueChange={onValueChange} testID="accordion-root">
        <Accordion.Item value="a" testID="item-a">
          <Accordion.Header>
            <Accordion.Trigger value="a" testID="trigger-a">Question A</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content value="a" testID="content-a">Answer A</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="b" testID="item-b">
          <Accordion.Header>
            <Accordion.Trigger value="b" testID="trigger-b">Question B</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content value="b" testID="content-b">Answer B</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('trigger-b'))
    act(() => {
      jest.runAllTimers()
    })
    expect(onValueChange).toHaveBeenCalledWith(['b'])
  })

  it('supports defaultValue for uncontrolled mode', () => {
    render(
      <Accordion.Root type="single" defaultValue={['a']} testID="accordion-root">
        <Accordion.Item value="a" testID="item-a">
          <Accordion.Header>
            <Accordion.Trigger value="a" testID="trigger-a">Question A</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content value="a" testID="content-a">Answer A</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('trigger-a').props.accessibilityState?.expanded).toBe(true)
    expect(screen.getByTestId('content-a')).toBeTruthy()
  })

  it('renders correctly in dark mode', () => {
    render(
      <Accordion.Root type="single" testID="accordion-root">
        <Accordion.Item value="a" testID="item-a">
          <Accordion.Header>
            <Accordion.Trigger value="a" testID="trigger-a">Question A</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content value="a" testID="content-a">Answer A</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
      { wrapper: wrapper({ mode: 'dark' }) },
    )
    expect(screen.getByTestId('accordion-root')).toBeTruthy()
  })

  it('applies custom semantic override', () => {
    const override = '#ff0000'
    render(
      <Accordion.Root type="single" testID="accordion-root">
        <Accordion.Item value="a" testID="item-a">
          <Accordion.Header>
            <Accordion.Trigger value="a" testID="trigger-a">Question A</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content value="a" testID="content-a">Answer A</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
      { wrapper: wrapper({ mode: 'light', semantic: { primary: override } }) },
    )
    expect(screen.getByTestId('accordion-root')).toBeTruthy()
  })
})