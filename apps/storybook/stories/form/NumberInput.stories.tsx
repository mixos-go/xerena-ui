import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { NumberInput, Text } from '@xerena/react'

const meta: Meta<typeof NumberInput> = {
  title: 'Form/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof NumberInput>

export const Default: T = {
  render: () => {
    const [value, setValue] = useState(5)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <NumberInput value={value} onValueChange={setValue} />
        <Text size="sm" variant="muted">Value: {value}</Text>
      </div>
    )
  },
}
export const Compact: T = {
  render: () => {
    const [value, setValue] = useState(3)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <NumberInput value={value} onValueChange={setValue} variant="compact" />
        <Text size="sm" variant="muted">Value: {value}</Text>
      </div>
    )
  },
}
export const WithMinMax: T = {
  render: () => {
    const [value, setValue] = useState(50)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <NumberInput value={value} onValueChange={setValue} min={0} max={100} step={5} />
        <Text size="sm" variant="muted">Value: {value}</Text>
      </div>
    )
  },
}
export const Disabled: T = {
  render: () => (
    <NumberInput value={7} disabled />
  ),
}