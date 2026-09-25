'use client'

import { Button } from '@xerena/react'
import { Preview } from '@xerena/preview'

export function ButtonDemo() {
  return (
    <Preview title="Primary button" code='<Button variant="primary" size="md">Save</Button>'>
      <Button variant="primary" size="md">Save</Button>
    </Preview>
  )
}
