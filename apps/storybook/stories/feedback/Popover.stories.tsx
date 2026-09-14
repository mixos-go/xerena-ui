import type { Meta, StoryObj } from '@storybook/react'
import { Button, Popover } from '@xerena/react'

const meta: Meta<typeof Popover.Root> = {
  title: 'Feedback/Popover',
  component: Popover.Root,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Popover.Root>

const Body = (
  <div style={{ padding: '8px 4px', minWidth: 160 }}>
    <div style={{ padding: '4px 12px' }}>Profile</div>
    <div style={{ padding: '4px 12px' }}>Settings</div>
    <div style={{ padding: '4px 12px' }}>Sign out</div>
  </div>
)

export const Default: T = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="outline">Open popover</Button>
      </Popover.Trigger>
      <Popover.Content>{Body}</Popover.Content>
    </Popover.Root>
  ),
}
export const Top: T = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="soft">Top</Button>
      </Popover.Trigger>
      <Popover.Content side="top">{Body}</Popover.Content>
    </Popover.Root>
  ),
}
export const Left: T = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="soft">Left</Button>
      </Popover.Trigger>
      <Popover.Content side="left">{Body}</Popover.Content>
    </Popover.Root>
  ),
}
export const Right: T = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="soft">Right</Button>
      </Popover.Trigger>
      <Popover.Content side="right">{Body}</Popover.Content>
    </Popover.Root>
  ),
}