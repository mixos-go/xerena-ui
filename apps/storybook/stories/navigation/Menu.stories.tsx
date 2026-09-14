import type { Meta, StoryObj } from '@storybook/react'
import { Button, Menu } from '@xerena/react'

const meta: Meta<typeof Menu.Root> = {
  title: 'Navigation/Menu',
  component: Menu.Root,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Menu.Root>

export const Default: T = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger>
        <Button variant="outline">Open menu</Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item onClick={() => undefined}>Profile</Menu.Item>
        <Menu.Item onClick={() => undefined}>Settings</Menu.Item>
        <Menu.Item onClick={() => undefined}>Sign out</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
}
export const WithLabelAndSeparator: T = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger>
        <Button variant="outline">Account</Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Label>Account</Menu.Label>
        <Menu.Item onClick={() => undefined}>Profile</Menu.Item>
        <Menu.Item onClick={() => undefined}>Billing</Menu.Item>
        <Menu.Separator />
        <Menu.Item onClick={() => undefined}>Sign out</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
}
export const WithDisabledItem: T = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger>
        <Button variant="outline">Actions</Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item onClick={() => undefined}>Duplicate</Menu.Item>
        <Menu.Item disabled>Archive</Menu.Item>
        <Menu.Item onClick={() => undefined}>Delete</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
}