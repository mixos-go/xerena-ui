import type { Meta, StoryObj } from '@storybook/react'
import {
  Body,
  Button,
  Cell,
  Head,
  Provider,
  Row,
  RowActions,
  Table,
  TableCheckbox,
  useTableSelection,
} from '@xerena/react'

const ROWS = [
  { id: '1', name: 'Ada Lovelace', role: 'Analyst', status: 'Active' },
  { id: '2', name: 'Alan Turing', role: 'Researcher', status: 'Active' },
  { id: '3', name: 'Grace Hopper', role: 'Admiral', status: 'Away' },
  { id: '4', name: 'Katherine Johnson', role: 'Mathematician', status: 'Active' },
  { id: '5', name: 'Margaret Hamilton', role: 'Director', status: 'Away' },
]

const SampleBody = () => (
  <>
    <Head>
      <Row>
        <Cell as="th">Name</Cell>
        <Cell as="th">Role</Cell>
        <Cell as="th">Status</Cell>
      </Row>
    </Head>
    <Body>
      {ROWS.map((r) => (
        <Row key={r.id}>
          <Cell>{r.name}</Cell>
          <Cell>{r.role}</Cell>
          <Cell>{r.status}</Cell>
        </Row>
      ))}
    </Body>
  </>
)

const meta: Meta<typeof Table> = {
  title: 'Data/Table',
  component: Table,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Table>

export const Outlined: T = { render: () => <Table variant="outlined"><SampleBody /></Table> }
export const Striped: T = { render: () => <Table variant="striped"><SampleBody /></Table> }
export const Grid: T = { render: () => <Table variant="grid"><SampleBody /></Table> }
export const Hover: T = { render: () => <Table variant="hover"><SampleBody /></Table> }
export const Small: T = { render: () => <Table size="sm"><SampleBody /></Table> }
export const Large: T = { render: () => <Table size="lg"><SampleBody /></Table> }
export const FrozenHeader: T = {
  render: () => (
    <Table frozenHeader maxHeight={180}>
      <Head>
        <Row>
          <Cell as="th">Name</Cell>
          <Cell as="th">Role</Cell>
          <Cell as="th">Status</Cell>
        </Row>
      </Head>
      <Body>
        {ROWS.map((r) => (
          <Row key={r.id}>
            <Cell>{r.name}</Cell>
            <Cell>{r.role}</Cell>
            <Cell>{r.status}</Cell>
          </Row>
        ))}
      </Body>
    </Table>
  ),
}
export const WithSelection: T = {
  render: () => {
    const ids = ROWS.map((r) => r.id)
    const { selected, toggle } = useTableSelection()
    const allSelected = ids.every((id) => selected.has(id))
    const someSelected = ids.some((id) => selected.has(id))
    return (
      <Table>
        <Head>
          <Row>
            <Cell as="th">
              <TableCheckbox
                checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                onCheckedChange={(checked) => {
                  ids.forEach((id) => {
                    const isSelected = selected.has(id)
                    if ((checked && !isSelected) || (!checked && isSelected)) toggle(id)
                  })
                }}
                ariaLabel="Select all rows"
              />
            </Cell>
            <Cell as="th">Name</Cell>
            <Cell as="th">Role</Cell>
            <Cell as="th">Status</Cell>
          </Row>
        </Head>
        <Body>
          {ROWS.map((r) => (
            <Row key={r.id}>
              <Cell>
                <TableCheckbox checked={selected.has(r.id)} onCheckedChange={() => toggle(r.id)} ariaLabel={`Select ${r.name}`} />
              </Cell>
              <Cell>{r.name}</Cell>
              <Cell>{r.role}</Cell>
              <Cell>{r.status}</Cell>
            </Row>
          ))}
        </Body>
      </Table>
    )
  },
}
export const ExpandableRows: T = {
  render: () => (
    <Table>
      <Head>
        <Row>
          <Cell as="th" />
          <Cell as="th">Name</Cell>
          <Cell as="th">Status</Cell>
        </Row>
      </Head>
      <Body>
        {ROWS.map((r) => (
          <Row key={r.id} expandable expandContent={`Details for ${r.name}: serves as ${r.role}.`}>
            <Cell>{r.name}</Cell>
            <Cell>{r.status}</Cell>
          </Row>
        ))}
      </Body>
    </Table>
  ),
}
export const WithRowActions: T = {
  render: () => (
    <Table>
      <Head>
        <Row>
          <Cell as="th">Name</Cell>
          <Cell as="th">Role</Cell>
          <Cell as="th">Actions</Cell>
        </Row>
      </Head>
      <Body>
        {ROWS.map((r) => (
          <Row key={r.id}>
            <Cell>{r.name}</Cell>
            <Cell>{r.role}</Cell>
            <RowActions>
              <Button size="sm" variant="ghost">Edit</Button>
              <Button size="sm" variant="ghost">Delete</Button>
            </RowActions>
          </Row>
        ))}
      </Body>
    </Table>
  ),
}
export const Dark: T = {
  render: () => (
    <Provider theme={{ mode: 'dark' }}>
      <Table>
        <Head>
          <Row>
            <Cell as="th">Name</Cell>
            <Cell as="th">Role</Cell>
            <Cell as="th">Status</Cell>
          </Row>
        </Head>
        <Body>
          {ROWS.slice(0, 3).map((r) => (
            <Row key={r.id}>
              <Cell>{r.name}</Cell>
              <Cell>{r.role}</Cell>
              <Cell>{r.status}</Cell>
            </Row>
          ))}
        </Body>
      </Table>
    </Provider>
  ),
}