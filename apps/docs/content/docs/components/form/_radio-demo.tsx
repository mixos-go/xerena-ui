'use client'

import { useState } from 'react'
import { Radio, RadioGroup } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<RadioGroup value={tone} onValueChange={setTone}>
  <Radio value="warm">Warm</Radio>
  <Radio value="cool">Cool</Radio>
</RadioGroup>`

export function RadioDemo() {
  const [tone, setTone] = useState('warm')
  return (
    <Preview title="Pick a tone" code={code}>
      <RadioGroup value={tone} onValueChange={setTone}>
        <Radio value="warm">Warm</Radio>
        <Radio value="cool">Cool</Radio>
      </RadioGroup>
      <p>Selected: {tone}</p>
    </Preview>
  )
}
