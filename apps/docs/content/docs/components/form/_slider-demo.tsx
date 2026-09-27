'use client'

import { useState } from 'react'
import { Slider } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Slider value={volume} min={0} max={100} onValueChange={setVolume} />`

export function SliderDemo() {
  const [volume, setVolume] = useState(40)
  return (
    <Preview title="Volume" code={code}>
      <Slider value={volume} min={0} max={100} onValueChange={setVolume} />
      <p>Volume: {volume}</p>
    </Preview>
  )
}
