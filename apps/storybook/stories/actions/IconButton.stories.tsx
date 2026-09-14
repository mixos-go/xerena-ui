import type { Meta, StoryObj } from '@storybook/react'
import { IconButton, Provider, Stack } from '@xerena/react'

const meta: Meta<typeof IconButton> = {
  title: 'Actions/IconButton',
  component: IconButton,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof IconButton>

export const Primary: T = { args: { 'aria-label': 'Menu', children: '☰' } }
export const Ghost: T = { args: { variant: 'ghost', 'aria-label': 'Menu', children: '☰' } }
export const Outline: T = { args: { variant: 'outline', 'aria-label': 'Menu', children: '☰' } }
export const Soft: T = { args: { variant: 'soft', 'aria-label': 'Menu', children: '☰' } }
export const Destructive: T = { args: { variant: 'destructive', 'aria-label': 'Delete', children: '✕' } }
export const Small: T = { args: { size: 'sm', 'aria-label': 'Menu', children: '☰' } }
export const Large: T = { args: { size: 'lg', 'aria-label': 'Menu', children: '☰' } }
export const Animated: T = { args: { animated: true, 'aria-label': 'Menu', children: '☰' } }
export const Disabled: T = { args: { disabled: true, 'aria-label': 'Menu', children: '☰' } }
export const Dark: T = {
  render: () => (
    <Provider theme={{ mode: 'dark' }}>
      <Stack orientation="horizontal" spacing="md">
        <IconButton aria-label="Menu">☰</IconButton>
        <IconButton variant="soft" aria-label="Search">⌕</IconButton>
        <IconButton variant="outline" aria-label="More">⋯</IconButton>
      </Stack>
    </Provider>
  ),
}