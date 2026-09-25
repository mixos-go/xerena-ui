'use client'

import { useState } from 'react'
import { Select } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Select value={region} onChange={(event) => setRegion(event.target.value)}>
  <option value="eu">Europe</option>
  <option value="na">North America</option>
</Select>`

export function SelectDemo() {
  const [region, setRegion] = useState('eu')
  return (
    <Preview title="Select a region" code={code}>
      <Select value={region} onChange={(event) => setRegion(event.target.value)}>
        <option value="eu">Europe</option>
        <option value="na">North America</option>
      </Select>
    </Preview>
  )
}
