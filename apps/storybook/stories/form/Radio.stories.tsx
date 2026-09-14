import type { Meta, StoryObj } from '@storybook/react'
import { Radio, Stack, Text } from '@xerena/react'

const meta: Meta<typeof Radio> = {
  title: 'Form/Radio',
  component: Radio,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Radio>

export const Unchecked: T = {
  render: () => (
    <Stack orientation="horizontal" spacing="sm" alignItems="center">
      <Radio value="a" />
      <Text>Option A</Text>
    </Stack>
  ),
}
export const Checked: T = {
  render: () => (
    <Stack orientation="horizontal" spacing="sm" alignItems="center">
      <Radio value="a" checked />
      <Text>Option A</Text>
    </Stack>
  ),
}
export const Disabled: T = {
  render: () => (
    <Stack orientation="horizontal" spacing="sm" alignItems="center">
      <Radio value="a" disabled />
      <Text>Option A</Text>
    </Stack>
  ),
}