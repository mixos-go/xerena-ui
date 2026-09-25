'use client'

import { useState } from 'react'
import { Dialog } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Dialog.Root open={open} onClose={() => setOpen(false)}>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Close />
      <Dialog.Title>Confirm action</Dialog.Title>
      <Dialog.Description>This action cannot be undone.</Dialog.Description>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>`

export function DialogDemo() {
  const [open, setOpen] = useState(false)
  return (
    <Preview title="Confirm dialog" code={code}>
      <button type="button" onClick={() => setOpen(true)}>
        Open dialog
      </button>
      <Dialog.Root open={open} onClose={() => setOpen(false)}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Close />
            <Dialog.Title>Confirm action</Dialog.Title>
            <Dialog.Description>This action cannot be undone.</Dialog.Description>
            <Dialog.Close>Confirm</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Preview>
  )
}
