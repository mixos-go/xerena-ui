import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Button, Dialog, Provider } from '@xerena/react'

const meta: Meta<typeof Dialog.Root> = {
  title: 'Feedback/Dialog',
  component: Dialog.Root,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Dialog.Root>

export const Default: T = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog.Root open={open} onClose={() => setOpen(false)}>
          <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content>
              <Dialog.Close />
              <Dialog.Title>Confirm action</Dialog.Title>
              <Dialog.Description>This action cannot be undone.</Dialog.Description>
              <Button variant="destructive" onClick={() => setOpen(false)}>Confirm</Button>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </>
    )
  },
}
export const LongContent: T = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open long dialog</Button>
        <Dialog.Root open={open} onClose={() => setOpen(false)}>
          <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content>
              <Dialog.Close />
              <Dialog.Title>Terms of service</Dialog.Title>
              <Dialog.Description>
                Please review the terms carefully before continuing. This dialog demonstrates a longer description.
              </Dialog.Description>
              <Button onClick={() => setOpen(false)}>Accept</Button>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </>
    )
  },
}
export const Dark: T = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <Provider theme={{ mode: 'dark' }}>
        <Button onClick={() => setOpen(true)}>Open dark dialog</Button>
        <Dialog.Root open={open} onClose={() => setOpen(false)}>
          <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content>
              <Dialog.Close />
              <Dialog.Title>Dark mode</Dialog.Title>
              <Dialog.Description>The dialog follows the active theme.</Dialog.Description>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </Provider>
    )
  },
}