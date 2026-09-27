'use client'

import { Button, Stack } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Stack orientation="horizontal" spacing="md" alignItems="center">
  <Button>Save</Button>
  <Button variant="ghost">Cancel</Button>
</Stack>`

export function StackDemo() {
  return (
    <Preview title="Horizontal stack" code={code}>
      <Stack orientation="horizontal" spacing="md" alignItems="center">
        <Button>Save</Button>
        <Button variant="ghost">Cancel</Button>
      </Stack>
    </Preview>
  )
}
