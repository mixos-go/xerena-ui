'use client'

import { Progress } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Progress value={62} variant="bar" label="Upload progress" />
<Progress value={40} variant="circle" size={96} stroke={10} label="Download progress" />`

export function ProgressDemo() {
  return (
    <Preview title="Progress indicators" code={code}>
      <Progress value={62} variant="bar" label="Upload progress" />
      <Progress value={40} variant="circle" size={96} stroke={10} label="Download progress" />
    </Preview>
  )
}
