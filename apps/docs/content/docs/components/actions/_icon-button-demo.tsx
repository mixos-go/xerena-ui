'use client'

import { IconButton } from '@xerena/react'
import { Preview } from '@xerena/preview'

export function IconButtonDemo() {
  return (
    <Preview title="Icon-only button" code='<IconButton aria-label="Close">×</IconButton>'>
      <IconButton aria-label="Close">×</IconButton>
    </Preview>
  )
}
