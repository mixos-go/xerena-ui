'use client'

import { useState } from 'react'
import { Input } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Input placeholder="Ada Lovelace" value={name} onChange={(event) => setName(event.target.value)} />`

export function InputDemo() {
  const [name, setName] = useState('')
  return (
    <Preview title="Your name" code={code}>
      <Input placeholder="Ada Lovelace" value={name} onChange={(event) => setName(event.target.value)} />
      <p>Name: {name === '' ? '—' : name}</p>
    </Preview>
  )
}
