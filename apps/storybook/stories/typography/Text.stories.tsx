import type { Meta, StoryObj } from '@storybook/react'
import { Text } from '@xerena/react'

const meta: Meta<typeof Text> = {
  title: 'Typography/Text',
  component: Text,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Text>

export const Body: T = { args: { children: 'Body text' } }
export const Muted: T = { args: { variant: 'muted', children: 'Muted text' } }
export const Strong: T = { args: { variant: 'strong', children: 'Strong text' } }
export const Error: T = { args: { variant: 'error', children: 'Error text' } }
export const Small: T = { args: { size: 'sm', children: 'Small text' } }
export const Large: T = { args: { size: 'lg', children: 'Large text' } }
export const Mono: T = { args: { font: 'mono', children: 'const answer = 42' } }
export const Centered: T = { args: { center: true, children: 'Centered text' } }
export const Truncated: T = {
  args: { truncate: true, children: 'A very long text that should truncate with an ellipsis when it runs out of space' },
  parameters: { docs: { storyDescription: 'Must truncate with ellipsis when space runs out' } },
}
export const AsChildLink: T = {
  args: { asChild: true, children: <a href="https://example.com">link element</a> },
}