import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, Stack } from '@xerena/react'

const meta: Meta<typeof Avatar> = {
  title: 'Surfaces/Avatar',
  component: Avatar,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Avatar>

export const Initials: T = { args: { variant: 'initials', initials: 'AB' } }
export const Image: T = {
  args: { variant: 'image', src: 'https://i.pravatar.cc/120?img=3', alt: 'User avatar' },
}
export const Icon: T = { args: { variant: 'icon', icon: '★' } }
export const Square: T = { args: { variant: 'initials', initials: 'XY', shape: 'square' } }
export const Sizes: T = {
  render: () => (
    <Stack orientation="horizontal" spacing="md" alignItems="center">
      <Avatar variant="initials" initials="AB" size="sm" />
      <Avatar variant="initials" initials="CD" size="md" />
      <Avatar variant="initials" initials="EF" size="lg" />
      <Avatar variant="initials" initials="GH" size="xl" />
    </Stack>
  ),
}
export const Clickable: T = { args: { variant: 'initials', initials: 'AB', onClick: () => undefined } }