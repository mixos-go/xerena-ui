'use client'

import { Card, Text } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Card variant="elevated" padding="lg">
  <Text variant="strong">Dashboard</Text>
</Card>`

export function CardDemo() {
  return (
    <Preview title="Elevated card" code={code}>
      <Card variant="elevated" padding="lg">
        <Text variant="strong">Dashboard</Text>
      </Card>
    </Preview>
  )
}
