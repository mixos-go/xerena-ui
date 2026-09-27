'use client'

import { Breadcrumb } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Breadcrumb>
  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
  <Breadcrumb.Item href="/guides">Guides</Breadcrumb.Item>
  <Breadcrumb.Item current>Components</Breadcrumb.Item>
</Breadcrumb>`

export function BreadcrumbDemo() {
  return (
    <Preview title="Hierarchy trail" code={code}>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/guides">Guides</Breadcrumb.Item>
        <Breadcrumb.Item current>Components</Breadcrumb.Item>
      </Breadcrumb>
    </Preview>
  )
}
