import type { Meta, StoryObj } from '@storybook/react'
import { Button, Provider, Stack } from '@xerena/react'

const meta: Meta<typeof Button> = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Button>

export const Primary: T = { args: { children: 'Primary' } }
export const Ghost: T = { args: { variant: 'ghost', children: 'Ghost' } }
export const Outline: T = { args: { variant: 'outline', children: 'Outline' } }
export const Soft: T = { args: { variant: 'soft', children: 'Soft' } }
export const Destructive: T = { args: { variant: 'destructive', children: 'Delete' } }
export const Link: T = { args: { variant: 'link', children: 'Link' } }
export const Small: T = { args: { size: 'sm', children: 'Small' } }
export const Large: T = { args: { size: 'lg', children: 'Large' } }
export const Animated: T = { args: { animated: true, children: 'Animated hover' } }
export const Loading: T = { args: { loading: true, children: 'Saving...' } }
export const Disabled: T = { args: { disabled: true, children: 'Disabled' } }
export const LeftIcon: T = { args: { leftIcon: <span aria-hidden="true">→</span>, children: 'With icon' } }
export const RightIcon: T = { args: { rightIcon: <span aria-hidden="true">›</span>, children: 'With icon' } }
export const FullWidth: T = { args: { fullWidth: true, children: 'Full width' }, parameters: { layout: 'padded' } }
export const SizeRow: T = {
  render: () => (
    <Stack orientation="horizontal" spacing="md" alignItems="center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </Stack>
  ),
}
export const VariantRow: T = {
  render: () => (
    <Stack orientation="horizontal" spacing="md">
      <Button variant="primary">Primary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="soft">Soft</Button>
    </Stack>
  ),
}
export const Dark: T = {
  render: () => (
    <Provider theme={{ mode: 'dark' }}>
      <Stack orientation="horizontal" spacing="md">
        <Button>Primary</Button>
        <Button variant="destructive">Delete</Button>
        <Button variant="outline">Outline</Button>
      </Stack>
    </Provider>
  ),
}