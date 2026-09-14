import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from './Pagination'
describe('Pagination', () => {
  it('renders page buttons with aria-current on the active page', () => {
    render(<Pagination total={20} pageSize={5} current={2} onChange={() => {}} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByText('2')).toHaveAttribute('aria-current', 'page')
  })
  it('renders simple variant with prev/next only', () => {
    render(<Pagination total={20} pageSize={5} current={1} onChange={() => {}} variant="simple" />)
    expect(screen.getByText('1 / 4')).toBeInTheDocument()
  })
  it('shows preview popover on hover when renderPagePreview provided', async () => {
    const Preview = () => <span>Preview</span>
    render(<Pagination total={20} pageSize={5} current={1} onChange={() => {}} siblingCount={2} renderPagePreview={() => <Preview />} />)
    const page3 = screen.getByText('3')
    await userEvent.hover(page3)
    await waitFor(() => expect(screen.queryByText('Preview')).toBeInTheDocument())
  })
})
