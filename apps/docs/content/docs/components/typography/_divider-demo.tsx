'use client'

import { Divider } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Divider />
<Divider label="or" />`

export function DividerDemo() {
  return (
    <Preview title="Dividers" code={code}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Divider />
        <Divider label="or" />
      </div>
    </Preview>
  )
}
