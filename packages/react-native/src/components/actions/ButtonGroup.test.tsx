import { fireEvent, render, screen } from '@testing-library/react-native'
import { semantic } from '@xerena/tokens'
import { Provider } from '../../primitives/Provider'
import { Button } from './Button'
import { ButtonGroup } from './ButtonGroup'

function wrapper(theme: { mode: 'light' | 'dark' } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('ButtonGroup', () => {
  it('renders horizontal group with gap', () => {
    render(
      <ButtonGroup testID="group" spacing="md">
        <Button value="a">A</Button>
      </ButtonGroup>,
      { wrapper: wrapper() },
    )
    const group = screen.getByTestId('group')
    expect(group).toHaveStyle({ flexDirection: 'row' })
    expect(group).toHaveStyle({ gap: semantic.spacing.md })
  })

  it('renders vertical group', () => {
    render(
      <ButtonGroup testID="group" orientation="vertical">
        <Button value="a">A</Button>
      </ButtonGroup>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('group')).toHaveStyle({ flexDirection: 'column' })
  })

  it('selects child buttons keyed by value and calls onValueChange', () => {
    const onValueChange = jest.fn()
    render(
      <ButtonGroup onValueChange={onValueChange}>
        <Button testID="a" value="a">
          A
        </Button>
        <Button testID="b" value="b">
          B
        </Button>
      </ButtonGroup>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('a').props.accessibilityState).toMatchObject({ selected: false })
    fireEvent.press(screen.getByTestId('b'))
    expect(onValueChange).toHaveBeenCalledWith('b')
    expect(screen.getByTestId('b').props.accessibilityState).toMatchObject({ selected: true })
  })

  it('respects controlled value', () => {
    render(
      <ButtonGroup value="a">
        <Button testID="a" value="a">
          A
        </Button>
        <Button testID="b" value="b">
          B
        </Button>
      </ButtonGroup>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('a').props.accessibilityState).toMatchObject({ selected: true })
    expect(screen.getByTestId('b').props.accessibilityState).toMatchObject({ selected: false })
  })
})
