'use client'

import { useState } from 'react'
import { NumberInput } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<NumberInput value={count} onValueChange={setCount} min={0} max={10} />`

export function NumberInputDemo() {
  const [count, setCount] = useState(4)
  return (
    <Preview title="Quantity" code={code}>
      <NumberInput value={count} onValueChange={setCount} min={0} max={10} />
      <p>Count: {count}</p>
    </Preview>
  )
}
