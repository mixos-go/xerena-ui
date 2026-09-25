'use client'

import { useState } from 'react'
import { Drawer } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Drawer.Root open={open} onClose={close} side="right" size="md">
  <Drawer.Content side="right">
    <h2>Filters</h2>
    <button type="button" onClick={close}>Apply</button>
  </Drawer.Content>
</Drawer.Root>`

export function DrawerDemo() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return (
    <Preview title="Side panel" code={code}>
      <button type="button" onClick={() => setOpen(true)}>
        Open drawer
      </button>
      <Drawer.Root open={open} onClose={close} side="right" size="md">
        <Drawer.Content side="right">
          <h2>Filters</h2>
          <button type="button" onClick={close}>
            Apply
          </button>
        </Drawer.Content>
      </Drawer.Root>
    </Preview>
  )
}
