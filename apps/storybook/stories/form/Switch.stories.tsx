import type { Meta, StoryObj } from '@storybook/react'
import { Switch, Stack, Text } from '@xerena/react'

const meta: Meta<typeof Switch> = {
  title: 'Form/Switch',
  component: Switch,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Switch>

export const Off: T = {
  render: () => (
    <Stack orientation="horizontal" spacing="sm" alignItems="center">
      <Switch />
      <Text>Notifications off</Text>
    </Stack>
  ),
}
export const On: T = {
  render: () => (
    <Stack orientation="horizontal" spacing="sm" alignItems="center">
      <Switch checked />
      <Text>Notifications on</Text>
    </Stack>
  ),
}
export const Small: T = {
  render: () => (
    <Stack orientation="horizontal" spacing="sm" alignItems="center">
      <Switch size="sm" checked />
      <Text>Compact switch</Text>
    </Stack>
  ),
}
export const Disabled: T = {
  render: () => (
    <Stack orientation="horizontal" spacing="sm" alignItems="center">
      <Switch disabled />
      <Text>Disabled</Text>
    </Stack>
  ),
}