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
  args: {
    variant: 'image',
    src: 'data:image/svg+xml;utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22%3E%3Crect width=%2240%22 height=%2240%22 fill=%22%23d9e6ff%22/%3E%3Ctext x=%2220%22 y=%2226%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2216%22 fill=%22%230055ff%22%3EXY%3C/text%3E%3C/svg%3E',
    alt: 'User avatar',
  },
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