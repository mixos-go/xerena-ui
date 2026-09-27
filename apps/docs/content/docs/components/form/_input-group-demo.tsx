'use client'

import { useState } from 'react'
import { Button, Input, InputGroup } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<InputGroup>
  <Input placeholder="Search" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search" />
  <Button size="md" variant="primary">Go</Button>
</InputGroup>`

export function InputGroupDemo() {
  const [query, setQuery] = useState('')
  return (
    <Preview title="Search group" code={code}>
      <InputGroup>
        <Input placeholder="Search" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search" />
        <Button size="md" variant="primary">Go</Button>
      </InputGroup>
      <p>Query: {query === '' ? '—' : query}</p>
    </Preview>
  )
}
