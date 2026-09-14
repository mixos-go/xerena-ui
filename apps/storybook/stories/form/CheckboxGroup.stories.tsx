import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox, CheckboxGroup, Text } from '@xerena/react'

const meta: Meta<typeof CheckboxGroup> = {
  title: 'Form/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof CheckboxGroup>

const Item = ({ label }: { label: string }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <Checkbox />
    <Text>{label}</Text>
  </label>
)

export const Default: T = {
  render: () => (
    <CheckboxGroup>
      <Item label="One" />
      <Item label="Two" />
      <Item label="Three" />
    </CheckboxGroup>
  ),
}
export const Vertical: T = {
  render: () => (
    <CheckboxGroup>
      <Item label="Option A" />
      <Item label="Option B" />
    </CheckboxGroup>
  ),
}
export const Controlled: T = {
  render: () => {
    const [value, setValue] = useState<string[]>(['b'])
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <CheckboxGroup value={value} onValueChange={setValue}>
          <Item label="Option A" />
          <Item label="Option B" />
        </CheckboxGroup>
        <Text size="sm" variant="muted">Selected: {value.join(', ') || 'none'}</Text>
      </div>
    )
  },
}