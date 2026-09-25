'use client'

import { Tooltip } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Tooltip content="Open settings" position="topCenter">
  <button type="button" aria-label="Settings">Settings</button>
</Tooltip>`

export function TooltipDemo() {
  return (
    <Preview title="Hover label" code={code}>
      <Tooltip content="Open settings" position="topCenter">
        <button type="button" aria-label="Settings">
          Settings
        </button>
      </Tooltip>
    </Preview>
  )
}
