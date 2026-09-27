'use client'

import { Text } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Text size="md" variant="body">Plain body copy.</Text>
<Text variant="muted">Secondary helper text.</Text>
<Text variant="strong">Bold emphasis.</Text>`

export function TextDemo() {
  return (
    <Preview title="Text variants" code={code}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text size="md" variant="body">
          Plain body copy.
        </Text>
        <Text variant="muted">Secondary helper text.</Text>
        <Text variant="strong">Bold emphasis.</Text>
      </div>
    </Preview>
  )
}
