import { fireEvent, render, screen } from '@testing-library/react-native'
import { Provider } from '../../../primitives/Provider'
import { Pagination } from './Pagination'

function wrapper(theme: { mode: 'light' | 'dark'; semantic?: Record<string, string> } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Pagination', () => {
  it('renders page navigation with role navigation', () => {
    render(
      <Pagination testID="pagination" total={20} pageSize={5} current={2} onChange={() => {}} />,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('pagination').props.role).toBe('navigation')
  })

  it('renders page buttons with current page highlighted', () => {
    render(
      <Pagination testID="pagination" total={20} pageSize={5} current={2} onChange={() => {}} />,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('page-2')).toBeTruthy()
    expect(screen.getByTestId('page-2').props.accessibilityState?.selected).toBe(true)
  })

  it('renders prev/next buttons', () => {
    render(
      <Pagination testID="pagination" total={20} pageSize={5} current={2} onChange={() => {}} />,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('prev-btn')).toBeTruthy()
    expect(screen.getByTestId('next-btn')).toBeTruthy()
  })

  it('disables prev button on first page', () => {
    render(
      <Pagination testID="pagination" total={20} pageSize={5} current={1} onChange={() => {}} />,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('prev-btn').props.accessibilityState?.disabled).toBe(true)
  })

  it('disables next button on last page', () => {
    render(
      <Pagination testID="pagination" total={20} pageSize={5} current={4} onChange={() => {}} />,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('next-btn').props.accessibilityState?.disabled).toBe(true)
  })

  it('calls onChange when page button pressed', () => {
    const onChange = jest.fn()
    render(
      <Pagination testID="pagination" total={20} pageSize={5} current={2} onChange={onChange} />,
      { wrapper: wrapper() },
    )
    fireEvent.press(screen.getByTestId('page-3'))
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('renders simple variant with page count only', () => {
    render(
      <Pagination testID="pagination" total={20} pageSize={5} current={1} onChange={() => {}} variant="simple" />,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('simple-pagination')).toBeTruthy()
    expect(screen.getByText('1 / 4')).toBeTruthy()
  })

  it('renders ellipsis for large page ranges', () => {
    render(
      <Pagination testID="pagination" total={100} pageSize={5} current={10} onChange={() => {}} siblingCount={1} />,
      { wrapper: wrapper() },
    )
    expect(screen.getByText('…')).toBeTruthy()
  })

  it('renders correctly in dark mode', () => {
    render(
      <Pagination testID="pagination" total={20} pageSize={5} current={2} onChange={() => {}} />,
      { wrapper: wrapper({ mode: 'dark' }) },
    )
    expect(screen.getByTestId('pagination')).toBeTruthy()
  })

  it('applies custom semantic override', () => {
    const override = '#ff0000'
    render(
      <Pagination testID="pagination" total={20} pageSize={5} current={1} onChange={() => {}} />,
      { wrapper: wrapper({ mode: 'light', semantic: { primary: override } }) },
    )
    expect(screen.getByTestId('page-1')).toBeTruthy()
  })
})