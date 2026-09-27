'use client'

import { Card, Grid } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Grid columns={3} gap="md">
  <Card>One</Card>
  <Card>Two</Card>
  <Card>Three</Card>
</Grid>`

export function GridDemo() {
  return (
    <Preview title="Three-column grid" code={code}>
      <Grid columns={3} gap="md">
        <Card>One</Card>
        <Card>Two</Card>
        <Card>Three</Card>
      </Grid>
    </Preview>
  )
}
