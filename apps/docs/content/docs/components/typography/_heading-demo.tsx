'use client'

import { Heading } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Heading as="h1">Page title</Heading>
<Heading as="h2">Section title</Heading>`

export function HeadingDemo() {
  return (
    <Preview title="Headings" code={code}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Heading as="h1">Page title</Heading>
        <Heading as="h2">Section title</Heading>
      </div>
    </Preview>
  )
}
