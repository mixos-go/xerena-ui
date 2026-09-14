import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton, Stack } from '@xerena/react'

const meta: Meta<typeof Skeleton> = {
  title: 'Typography/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Skeleton>

export const Line: T = { args: { shape: 'line', width: 240 } }
export const Circle: T = { args: { shape: 'circle', width: 48, height: 48 } }
export const Rect: T = { args: { shape: 'rect', width: 240, height: 96 } }
export const Text: T = { args: { shape: 'text', width: 200, height: 16 } }
export const Article: T = {
  render: () => (
    <Stack spacing="sm">
      <Skeleton shape="line" width={280} height={20} />
      <Skeleton shape="text" width={260} />
      <Skeleton shape="text" width={180} />
    </Stack>
  ),
}
export const ReducedMotion: T = {
  render: () => <Skeleton shape="line" width={240} />,
}