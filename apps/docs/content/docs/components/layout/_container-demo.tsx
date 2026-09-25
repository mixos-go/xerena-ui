'use client'

import { Container, Text } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Container size="lg">
  <Text>Centered page content.</Text>
</Container>`

export function ContainerDemo() {
  return (
    <Preview title="Centered container" code={code}>
      <Container size="lg">
        <Text>Centered page content.</Text>
      </Container>
    </Preview>
  )
}
