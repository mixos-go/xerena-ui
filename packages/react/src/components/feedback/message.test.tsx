import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Message } from './Message'

describe('Message', () => {
  it('renders with role=alert and danger tone', () => {
    render(<Message tone="danger" title="Error" description="Invalid input" />)
    expect(screen.getByRole('alert')).toHaveClass('xr-message', 'xr-message--danger')
    expect(screen.getByText('Error')).toBeInTheDocument()
  })
  it('calls onDismiss when close clicked', async () => {
    const onDismiss = vi.fn()
    render(<Message tone="info" title="OK" dismissible onDismiss={onDismiss}>Info</Message>)
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onDismiss).toHaveBeenCalled()
  })
})