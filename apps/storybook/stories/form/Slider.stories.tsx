import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Slider, Text } from '@xerena/react'

const meta: Meta<typeof Slider> = {
  title: 'Form/Slider',
  component: Slider,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Slider>

export const Controlled: T = {
  render: () => {
    const [value, setValue] = useState(40)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Slider value={value} onValueChange={setValue} />
        <Text size="sm" variant="muted">Value: {value}</Text>
      </div>
    )
  },
}
export const DefaultValue: T = {
  render: () => (
    <div style={{ width: 320 }}>
      <Slider defaultValue={65} />
    </div>
  ),
}
export const Vertical: T = {
  render: () => (
    <div style={{ height: 160 }}>
      <Slider defaultValue={50} orientation="vertical" />
    </div>
  ),
}
export const CustomRange: T = {
  render: () => (
    <div style={{ width: 320 }}>
      <Slider defaultValue={2} min={0} max={10} step={0.5} onValueChange={() => undefined} />
    </div>
  ),
}
export const Disabled: T = {
  render: () => (
    <div style={{ width: 320 }}>
      <Slider defaultValue={30} disabled />
    </div>
  ),
}