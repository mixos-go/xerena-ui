'use client'

import { Link } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Link href="https://example.com">Read the docs</Link>
<Link href="https://example.com" variant="muted">Secondary link</Link>
<Link href="https://example.com" variant="animated">Animated link</Link>`

export function LinkDemo() {
  return (
    <Preview title="Text links" code={code}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Link href="https://example.com">Read the docs</Link>
        <Link href="https://example.com" variant="muted">
          Secondary link
        </Link>
        <Link href="https://example.com" variant="animated">
          Animated link
        </Link>
      </div>
    </Preview>
  )
}
