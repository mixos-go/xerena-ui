import type { Meta, StoryObj } from '@storybook/react'
import { Divider, Stack } from '@xerena/react'

const meta: Meta<typeof Divider> = {
  title: 'Typography/Divider',
  component: Divider,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Divider>

export const Horizontal: T = { args: {} }
export const Vertical: T = {
  render: () => (
    <Stack orientation="horizontal" alignItems="center">
      <span>Left</span>
      <Divider orientation="vertical" />
      <span>Right</span>
    </Stack>
  ),
}
export const Dashed: T = { args: { variant: 'dashed' } }
export const WithLabel: T = { args: { label: 'OR' } }