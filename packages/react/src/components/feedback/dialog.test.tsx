import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dialog } from './Dialog'

describe('Dialog', () => {
  it('renders into portal with aria-modal when open', () => {
    render(<Dialog.Root open><Dialog.Portal><Dialog.Overlay /><Dialog.Content><Dialog.Title id="t">Hi</Dialog.Title><Dialog.Description>Desc</Dialog.Description></Dialog.Content></Dialog.Portal></Dialog.Root>)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('Hi').closest('[data-xerena-overlay]')).not.toBeNull()
  })
  it('wires aria-labelledby from Dialog.Title onto dialog and overlay', async () => {
    render(<Dialog.Root open><Dialog.Portal><Dialog.Overlay /><Dialog.Content><Dialog.Title id="t">Hi</Dialog.Title></Dialog.Content></Dialog.Portal></Dialog.Root>)
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAttribute('aria-labelledby', 't')
    expect(dialog.parentElement).toHaveAttribute('aria-labelledby', 't')
  })
  it('auto-generates a title id and uses it for labelling', async () => {
    render(<Dialog.Root open><Dialog.Portal><Dialog.Content><Dialog.Title>Auto</Dialog.Title></Dialog.Content></Dialog.Portal></Dialog.Root>)
    const dialog = await screen.findByRole('dialog')
    const titleId = dialog.getAttribute('aria-labelledby')
    expect(titleId).toBeTruthy()
    expect(document.getElementById(titleId as string)).toHaveTextContent('Auto')
  })
  it('calls onClose on Escape', async () => {
    const onClose = vi.fn()
    render(<Dialog.Root open onClose={onClose}><Dialog.Portal><Dialog.Overlay /><Dialog.Content>o</Dialog.Content></Dialog.Portal></Dialog.Root>)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})
