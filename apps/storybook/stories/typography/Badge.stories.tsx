import type { Meta, StoryObj } from '@storybook/react'
import { Badge, Provider } from '@xerena/react'

const meta: Meta<typeof Badge> = {
  title: 'Typography/Badge',
  component: Badge,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Badge>

export const Neutral: T = { args: { tone: 'neutral', children: 'Neutral' } }
export const Info: T = { args: { tone: 'info', children: 'Info' } }
export const Success: T = { args: { tone: 'success', children: 'Success' } }
export const Warning: T = { args: { tone: 'warning', children: 'Warning' } }
export const Danger: T = { args: { tone: 'danger', children: 'Danger' } }
export const Brand: T = { args: { tone: 'brand', children: 'Brand' } }
export const Small: T = { args: { size: 'sm', children: 'Small badge' } }
export const Medium: T = { args: { size: 'md', children: 'Medium badge' } }
export const Dark: T = {
  render: () => (
    <Provider theme={{ mode: 'dark' }}>
      <Badge tone="danger">Danger</Badge>
      <Badge tone="success">Success</Badge>
      <Badge tone="brand">Brand</Badge>
    </Provider>
  ),
}