import type { Meta, StoryObj } from '@storybook/react'
import { Kbd, Stack } from '@xerena/react'

const meta: Meta<typeof Kbd> = {
  title: 'Typography/Kbd',
  component: Kbd,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Kbd>

export const Default: T = { args: { children: '⌘' } }
export const Combo: T = {
  render: () => (
    <Stack orientation="horizontal" spacing="sm" alignItems="center">
      <Kbd>⌘</Kbd>
      <span>+</span>
      <Kbd>K</Kbd>
    </Stack>
  ),
}