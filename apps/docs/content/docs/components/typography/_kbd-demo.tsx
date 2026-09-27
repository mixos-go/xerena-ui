'use client'

import { Kbd } from '@xerena/react'
import { Preview } from '@xerena/preview'

export function KbdDemo() {
  return (
    <Preview title="Keyboard shortcut" code="<Kbd>⌘</Kbd><Kbd>K</Kbd>">
      <span style={{ display: 'inline-flex', gap: 4 }}>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
    </Preview>
  )
}
