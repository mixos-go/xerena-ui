import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox, Stack, Text } from '@xerena/react'

const meta: Meta<typeof Checkbox> = {
  title: 'Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Checkbox>

export const Unchecked: T = {
  render: () => (
    <Stack orientation="horizontal" spacing="sm" alignItems="center">
      <Checkbox />
      <Text>Enabled</Text>
    </Stack>
  ),
}
export const Checked: T = {
  render: () => (
    <Stack orientation="horizontal" spacing="sm" alignItems="center">
      <Checkbox checked />
      <Text>Subscribed</Text>
    </Stack>
  ),
}
export const Disabled: T = {
  render: () => (
    <Stack orientation="horizontal" spacing="sm" alignItems="center">
      <Checkbox disabled />
      <Text>Disabled</Text>
    </Stack>
  ),
}