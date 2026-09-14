import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dialog } from './Dialog'

describe('Dialog', () => {
  it('renders into portal with aria-modal when open', () => {
    render(<Dialog.Root open><Dialog.Portal><Dialog.Overlay /><Dialog.Content><Dialog.Title>Hi</Dialog.Title><Dialog.Description>Desc</Dialog.Description></Dialog.Content></Dialog.Portal></Dialog.Root>)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('Hi').closest('[data-xerena-overlay]')).not.toBeNull()
  })
  it('calls onClose on Escape', async () => {
    const onClose = vi.fn()
    render(<Dialog.Root open onClose={onClose}><Dialog.Portal><Dialog.Overlay /><Dialog.Content>o</Dialog.Content></Dialog.Portal></Dialog.Root>)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})