'use client'

import { Spinner } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Spinner size="sm" label="Saving" />
<Spinner size="md" label="Loading reports" />
<Spinner size="lg" label="Loading dashboard" />`

export function SpinnerDemo() {
  return (
    <Preview title="Loading indicators" code={code}>
      <Spinner size="sm" label="Saving" />
      <Spinner size="md" label="Loading reports" />
      <Spinner size="lg" label="Loading dashboard" />
    </Preview>
  )
}
