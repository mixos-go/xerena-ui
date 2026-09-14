import { render, screen } from '@testing-library/react'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('renders accessible spinner with role=status and aria-label', () => {
    render(<Spinner label="Loading…" />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading…')
    expect(screen.getByText('Loading…')).toHaveClass('sr-only')
  })
  it('applies size class', () => {
    render(<Spinner size="lg" />)
    expect(screen.getByRole('status').firstChild).toHaveClass('xr-spinner', 'xr-spinner--lg')
  })
})
