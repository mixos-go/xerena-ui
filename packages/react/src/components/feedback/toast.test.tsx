import { render, screen } from '@testing-library/react'
import { waitFor } from '@testing-library/react'
import { Toast } from './Toast'

describe('Toast', () => {
  it('renders with role=status and calls onDismiss after autoHideDuration', async () => {
    const onDismiss = vi.fn()
    render(<Toast title="Saved" autoHideDuration={100} onDismiss={onDismiss} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    await waitFor(() => expect(onDismiss).toHaveBeenCalled(), { timeout: 200 })
  })
})