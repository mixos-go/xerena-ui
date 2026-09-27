'use client'

import { Badge } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Badge tone="success">Active</Badge>
<Badge tone="warning" size="sm">Pending</Badge>
<Badge tone="brand">New</Badge>`

export function BadgeDemo() {
  return (
    <Preview title="Status badges" code={code}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <Badge tone="success">Active</Badge>
        <Badge tone="warning" size="sm">
          Pending
        </Badge>
        <Badge tone="brand">New</Badge>
      </div>
    </Preview>
  )
}
