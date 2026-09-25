'use client'

import { useState } from 'react'
import { Checkbox, CheckboxGroup } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<CheckboxGroup value={plans} onValueChange={setPlans}>
  <Checkbox checked={plans.includes('day')} onCheckedChange={() => toggle('day')} />
  <Checkbox checked={plans.includes('week')} onCheckedChange={() => toggle('week')} />
</CheckboxGroup>`

export function CheckboxGroupDemo() {
  const [plans, setPlans] = useState<string[]>(['week'])
  const toggle = (item: string) =>
    setPlans((prev) => (prev.includes(item) ? prev.filter((p) => p !== item) : [...prev, item]))
  return (
    <Preview title="Pick cadences" code={code}>
      <CheckboxGroup value={plans} onValueChange={setPlans}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Checkbox checked={plans.includes('day')} onCheckedChange={() => toggle('day')} />
          <span>Day</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Checkbox checked={plans.includes('week')} onCheckedChange={() => toggle('week')} />
          <span>Week</span>
        </div>
      </CheckboxGroup>
      <p>Selected: {plans.length === 0 ? 'none' : plans.join(', ')}</p>
    </Preview>
  )
}
