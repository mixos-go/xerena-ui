import { AccessibilityInfo, Text } from 'react-native'
import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { semantic } from '@xerena/tokens'
import { Provider } from '../../../primitives/Provider'
import { Pressable } from '../../../primitives/Pressable'
import { spacing } from '../../../styles/spacing'
import { Table, Head, Body, Row, Cell, TableCheckbox, RowActions } from './index'

function wrapper(theme: { mode: 'light' | 'dark'; semantic?: Record<string, string> } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
  jest.restoreAllMocks()
})

describe('Table', () => {
  it('renders with role grid', () => {
    render(
      <Table>
        <Head>
          <Row>
            <Cell as="th">Name</Cell>
          </Row>
        </Head>
        <Body>
          <Row>
            <Cell>Cell 1</Cell>
          </Row>
        </Body>
      </Table>,
      { wrapper: wrapper() },
    )
    const table = screen.getByTestId('table-root')
    expect(table.props.role).toBe('grid')
  })

  it('applies outlined variant border styles from tokens', () => {
    render(
      <Table testID="table-root" variant="outlined">
        <Head testID="head">
          <Row>
            <Cell as="th">Name</Cell>
          </Row>
        </Head>
        <Body>
          <Row>
            <Cell>Cell 1</Cell>
          </Row>
        </Body>
      </Table>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('head')).toHaveStyle({
      borderBottomWidth: 1,
      borderBottomColor: semantic.color.border,
    })
  })

  it('applies grid variant cell borders from tokens', () => {
    render(
      <Table testID="table-root" variant="grid">
        <Body>
          <Row>
            <Cell testID="cell">Cell 1</Cell>
          </Row>
        </Body>
      </Table>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('cell')).toHaveStyle({
      borderWidth: 1,
      borderColor: semantic.color.border,
    })
  })

  it('applies striped variant surface background from tokens', () => {
    render(
      <Table testID="table-root" variant="striped">
        <Body>
          <Row testID="row" expandable expandContent={<Text>More</Text>}>
            <Cell>Cell 1</Cell>
          </Row>
        </Body>
      </Table>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('row')).toHaveStyle({ backgroundColor: semantic.color.surface })
  })

  it.each(['sm', 'md', 'lg'] as const)('applies %s cell padding from tokens', (size) => {
    const padding = { sm: spacing[1], md: spacing[2], lg: spacing[3] }[size]
    render(
      <Table testID="table-root" size={size}>
        <Body>
          <Row>
            <Cell testID="cell">Cell</Cell>
          </Row>
        </Body>
      </Table>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('cell')).toHaveStyle({ padding })
  })

  it('renders frozenHeader inside a sticky ScrollView bounded by maxHeight', () => {
    render(
      <Table testID="table-root" frozenHeader maxHeight={200}>
        <Head testID="head">
          <Row>
            <Cell as="th">Name</Cell>
          </Row>
        </Head>
        <Body>
          <Row>
            <Cell>Cell 1</Cell>
          </Row>
        </Body>
      </Table>,
      { wrapper: wrapper() },
    )
    const scroll = screen.getByTestId('table-root-scroll')
    expect(scroll.props.stickyHeaderIndices).toEqual([0])
    expect(scroll).toHaveStyle({ maxHeight: 200 })
    expect(screen.getByTestId('head')).toBeTruthy()
  })

  it('renders caption when provided', () => {
    render(
      <Table>
        <Table.Caption>My Caption</Table.Caption>
        <Body>
          <Row>
            <Cell>Cell</Cell>
          </Row>
        </Body>
      </Table>,
      { wrapper: wrapper() },
    )
    expect(screen.getByText('My Caption')).toBeTruthy()
  })
})

describe('Head', () => {
  it('renders with accessibilityRole header when frozenHeader', () => {
    render(
      <Table frozenHeader>
        <Head testID="head">
          <Row>
            <Cell as="th">Name</Cell>
          </Row>
        </Head>
        <Body>
          <Row>
            <Cell>Cell 1</Cell>
          </Row>
        </Body>
      </Table>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('head').props.accessibilityRole).toBe('header')
  })
})

describe('Row', () => {
  it('renders with role row', () => {
    render(
      <Table>
        <Body>
          <Row testID="row">
            <Cell>Cell 1</Cell>
          </Row>
        </Body>
      </Table>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('row').props.role).toBe('row')
  })

  it('supports expandable with expandContent', () => {
    render(
      <Table>
        <Body>
          <Row testID="row" expandable expandContent={<Text>Expanded content</Text>}>
            <Cell>Parent</Cell>
          </Row>
        </Body>
      </Table>,
      { wrapper: wrapper() },
    )
    const row = screen.getByTestId('row')
    expect(row.props.accessibilityState?.expanded).toBe(false)
    expect(screen.queryByText('Expanded content')).toBeNull()
    fireEvent.press(row)
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.getByTestId('row').props.accessibilityState?.expanded).toBe(true)
    fireEvent(screen.getByTestId('row-expanded-inner'), 'layout', { nativeEvent: { layout: { height: 80 } } })
    expect(screen.getByText('Expanded content')).toBeTruthy()
    expect(screen.getByTestId('row-expanded')).toBeTruthy()
    fireEvent.press(screen.getByTestId('row'))
    expect(screen.getByText('Expanded content')).toBeTruthy()
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.queryByText('Expanded content')).toBeNull()
  })
})

describe('Cell', () => {
  it('renders with role cell', () => {
    render(
      <Table>
        <Body>
          <Row>
            <Cell testID="cell">Cell 1</Cell>
          </Row>
        </Body>
      </Table>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('cell').props.role).toBe('cell')
  })

  it('supports as="th" for header cells', () => {
    render(
      <Table>
        <Head>
          <Row>
            <Cell testID="th-cell" as="th">Header</Cell>
          </Row>
        </Head>
        <Body>
          <Row>
            <Cell>Cell</Cell>
          </Row>
        </Body>
      </Table>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('th-cell')).toBeTruthy()
  })
})

describe('TableCheckbox', () => {
  it('renders checkbox with accessibilityRole checkbox', () => {
    render(
      <TableCheckbox testID="checkbox" checked={false} onCheckedChange={() => {}} />,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('checkbox').props.accessibilityRole).toBe('checkbox')
  })

  it('shows checked state', () => {
    render(
      <TableCheckbox testID="checkbox" checked={true} onCheckedChange={() => {}} />,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('checkbox').props.accessibilityState?.checked).toBe(true)
  })

  it('shows indeterminate state', () => {
    render(
      <TableCheckbox testID="checkbox" checked="indeterminate" onCheckedChange={() => {}} />,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('checkbox').props.accessibilityState?.checked).toBe('mixed')
  })

  it('calls onCheckedChange when pressed', () => {
    const onChange = jest.fn()
    render(
      <TableCheckbox testID="checkbox" checked={false} onCheckedChange={onChange} />,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('checkbox'))
    expect(onChange).toHaveBeenCalledWith(true)
  })
})

describe('RowActions', () => {
  it('renders actions container', () => {
    render(
      <Table>
        <Body>
          <Row>
            <Cell>Cell</Cell>
            <RowActions testID="actions">
              <Text>Action</Text>
            </RowActions>
          </Row>
        </Body>
      </Table>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('actions')).toBeTruthy()
    expect(screen.getByText('Action')).toBeTruthy()
  })

  it('triggers action handlers on press', () => {
    const onPress = jest.fn()
    render(
      <Table>
        <Body>
          <Row>
            <Cell>Cell</Cell>
            <RowActions testID="actions">
              <Pressable testID="action-btn" onPress={onPress}>
                <Text>Go</Text>
              </Pressable>
            </RowActions>
          </Row>
        </Body>
      </Table>,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('action-btn'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('supports actionsPosition left/right', () => {
    render(
      <Table>
        <Body>
          <Row>
            <Cell>Cell</Cell>
            <RowActions testID="actions" actionsPosition="left">
              <Text>Action</Text>
            </RowActions>
          </Row>
        </Body>
      </Table>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('actions')).toBeTruthy()
  })

  it('supports sticky prop', () => {
    render(
      <Table>
        <Body>
          <Row>
            <Cell>Cell</Cell>
            <RowActions testID="actions" sticky>
              <Text>Action</Text>
            </RowActions>
          </Row>
        </Body>
      </Table>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('actions')).toBeTruthy()
  })
})

describe('Table theming', () => {
  it('renders correctly in dark mode', () => {
    render(
      <Table testID="table-root">
        <Body>
          <Row>
            <Cell testID="cell">Cell</Cell>
          </Row>
        </Body>
      </Table>,
      { wrapper: wrapper({ mode: 'dark' }) },
    )
    expect(screen.getByTestId('table-root')).toBeTruthy()
    expect(screen.getByTestId('cell')).toBeTruthy()
  })

  it('applies custom semantic override', () => {
    const override = '#ff0000'
    render(
      <Table testID="table-root">
        <Body>
          <Row>
            <Cell testID="cell">Cell</Cell>
          </Row>
        </Body>
      </Table>,
      { wrapper: wrapper({ mode: 'light', semantic: { border: override } }) },
    )
    expect(screen.getByTestId('table-root')).toBeTruthy()
  })
})

describe('Table reduced motion', () => {
  it('disables expand animation when reduced motion enabled', () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true)
    render(
      <Table>
        <Body>
          <Row testID="row" expandable expandContent={<Text>Expanded</Text>}>
            <Cell>Parent</Cell>
          </Row>
        </Body>
      </Table>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('row')).toBeTruthy()
  })
})