import { render, screen } from '@testing-library/react'
import { waitFor } from '@testing-library/react'
import { Toast, toast } from './Toast'
import userEvent from '@testing-library/user-event'

describe('Toast', () => {
  it('renders with role=status and calls onDismiss after autoHideDuration', async () => {
    const onDismiss = vi.fn()
    render(<Toast title="Saved" autoHideDuration={100} onDismiss={onDismiss} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    await waitFor(() => expect(onDismiss).toHaveBeenCalled(), { timeout: 200 })
  })
  it('imperative toast dismiss preserves user onDismiss', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    toast({ title: 'Hi', dismissible: true, onDismiss, autoHideDuration: 0 })
    const btn = await screen.findByRole('button', { name: 'Dismiss' })
    await user.click(btn)
    await waitFor(() => expect(onDismiss).toHaveBeenCalled())
    document.getElementById('xerena-toast-stack')?.remove()
  })
})
