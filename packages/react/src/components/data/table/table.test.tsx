import { render, screen } from '@testing-library/react'
import { Table, Head, Body, Row, Cell, TableCheckbox } from './index'
describe('Table', () => {
  it('renders with role table', () => {
    render(<Table><Head><Row><Cell as="th">N</Cell></Row></Head><Body><Row><Cell>1</Cell></Row></Body></Table>)
    expect(screen.getByRole('table')).toHaveClass('xr-table', 'xr-table--outlined')
  })
})
describe('Table selection', () => {
  it('select-all checkbox is indeterminate when some rows selected', () => {
    render(
      <Table><Head><Row><TableCheckbox checked="indeterminate" onCheckedChange={() => {}} /></Row></Head>
      <Body><Row><TableCheckbox checked={true} onCheckedChange={() => {}} /></Row></Body></Table>
    )
    expect(screen.getAllByRole('checkbox')[0]).toHaveAttribute('aria-checked', 'mixed')
  })
})
describe('Row expand', () => {
  it('sets aria-expanded on expand trigger', async () => {
    render(
      <Table><Body><Row expandable expandContent={<span>child</span>}>
        <Cell>parent</Cell>
      </Row></Body></Table>
    )
    expect(screen.getByText('parent').closest('[role="row"]')).toHaveAttribute('aria-expanded', 'false')
  })
})
