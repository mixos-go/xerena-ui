'use client'

import { useState } from 'react'
import { Switch } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Switch checked={enabled} onCheckedChange={setEnabled} />`

export function SwitchDemo() {
  const [enabled, setEnabled] = useState(false)
  return (
    <Preview title="Notifications" code={code}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
        <span>{enabled ? 'On' : 'Off'}</span>
      </div>
    </Preview>
  )
}
