import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Radio, RadioGroup, Text } from '@xerena/react'

const meta: Meta<typeof RadioGroup> = {
  title: 'Form/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof RadioGroup>

export const Vertical: T = {
  render: () => {
    const [value, setValue] = useState('one')
    return (
      <RadioGroup value={value} onValueChange={setValue} orientation="vertical">
        <Radio value="one" checked={value === 'one'}>One</Radio>
        <Radio value="two" checked={value === 'two'}>Two</Radio>
        <Radio value="three" checked={value === 'three'}>Three</Radio>
      </RadioGroup>
    )
  },
}
export const Horizontal: T = {
  render: () => {
    const [value, setValue] = useState('sm')
    return (
      <RadioGroup value={value} onValueChange={setValue} orientation="horizontal">
        <Radio value="sm" checked={value === 'sm'}>Small</Radio>
        <Radio value="md" checked={value === 'md'}>Medium</Radio>
        <Radio value="lg" checked={value === 'lg'}>Large</Radio>
      </RadioGroup>
    )
  },
}
export const Controlled: T = {
  render: () => {
    const [value, setValue] = useState('react')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <RadioGroup value={value} onValueChange={setValue}>
          <Radio value="react" checked={value === 'react'}>React</Radio>
          <Radio value="vue" checked={value === 'vue'}>Vue</Radio>
        </RadioGroup>
        <Text size="sm" variant="muted">Selected: {value}</Text>
      </div>
    )
  },
}