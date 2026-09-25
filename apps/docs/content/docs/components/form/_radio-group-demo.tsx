'use client'

import { useState } from 'react'
import { Radio, RadioGroup } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<RadioGroup value={plan} onValueChange={setPlan} orientation="horizontal">
  <Radio value="free">Free</Radio>
  <Radio value="pro">Pro</Radio>
  <Radio value="team">Team</Radio>
</RadioGroup>`

export function RadioGroupDemo() {
  const [plan, setPlan] = useState('pro')
  return (
    <Preview title="Pick a plan" code={code}>
      <RadioGroup value={plan} onValueChange={setPlan} orientation="horizontal">
        <Radio value="free">Free</Radio>
        <Radio value="pro">Pro</Radio>
        <Radio value="team">Team</Radio>
      </RadioGroup>
      <p>Plan: {plan}</p>
    </Preview>
  )
}
