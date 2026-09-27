'use client'

import { Skeleton } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Skeleton shape="line" width={240} height={16} />
<Skeleton shape="circle" width={40} height={40} />
<Skeleton shape="text" />`

export function SkeletonDemo() {
  return (
    <Preview title="Loading placeholders" code={code}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Skeleton shape="line" width={240} height={16} />
        <Skeleton shape="circle" width={40} height={40} />
        <Skeleton shape="text" />
      </div>
    </Preview>
  )
}
