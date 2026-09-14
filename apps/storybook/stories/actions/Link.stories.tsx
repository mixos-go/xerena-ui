import type { Meta, StoryObj } from '@storybook/react'
import { Link, Provider, Stack } from '@xerena/react'

const meta: Meta<typeof Link> = {
  title: 'Actions/Link',
  component: Link,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Link>

export const Default: T = { args: { href: 'https://example.com', children: 'Learn more' } }
export const Muted: T = { args: { variant: 'muted', href: 'https://example.com', children: 'Muted link' } }
export const Animated: T = { args: { variant: 'animated', href: 'https://example.com', children: 'Animated link' } }
export const External: T = {
  args: { href: 'https://example.com', target: '_blank', rel: 'noopener noreferrer', children: 'External link' },
}
export const Dark: T = {
  render: () => (
    <Provider theme={{ mode: 'dark' }}>
      <Stack orientation="horizontal" spacing="lg">
        <Link href="https://example.com">Default</Link>
        <Link variant="muted" href="https://example.com">Muted</Link>
        <Link variant="animated" href="https://example.com">Animated</Link>
      </Stack>
    </Provider>
  ),
}