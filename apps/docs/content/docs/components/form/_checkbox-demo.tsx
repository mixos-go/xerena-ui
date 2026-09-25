'use client'

import { useState } from 'react'
import { Checkbox } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Checkbox checked={agreed} onCheckedChange={setAgreed} />`

export function CheckboxDemo() {
  const [agreed, setAgreed] = useState(false)
  return (
    <Preview title="Accept terms" code={code}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Checkbox checked={agreed} onCheckedChange={setAgreed} />
        <span>{agreed ? 'Agreed' : 'Not agreed'}</span>
      </div>
    </Preview>
  )
}
