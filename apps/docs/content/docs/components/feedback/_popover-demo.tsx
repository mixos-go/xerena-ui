'use client'

import { useState } from 'react'
import { Popover } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Popover.Root>
  <Popover.Trigger>
    <button type="button">More options</button>
  </Popover.Trigger>
  <Popover.Content side="bottom">
    <button type="button">Copy</button>
    <button type="button">Duplicate</button>
  </Popover.Content>
</Popover.Root>`

export function PopoverDemo() {
  const [choice, setChoice] = useState('Copy')
  return (
    <Preview title="Anchored panel" code={code}>
      <Popover.Root>
        <Popover.Trigger>
          <button type="button">More options</button>
        </Popover.Trigger>
        <Popover.Content side="bottom">
          <button type="button" onClick={() => setChoice('Copy')}>
            Copy
          </button>
          <button type="button" onClick={() => setChoice('Duplicate')}>
            Duplicate
          </button>
        </Popover.Content>
      </Popover.Root>
      <p>Selected: {choice}</p>
    </Preview>
  )
}
