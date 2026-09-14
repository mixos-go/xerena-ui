import type { Meta, StoryObj } from '@storybook/react'
import { Button, Tooltip } from '@xerena/react'

const meta: Meta<typeof Tooltip> = {
  title: 'Feedback/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Tooltip>

export const Default: T = {
  render: () => (
    <Tooltip content="This is a tooltip">
      <Button variant="outline">Hover me</Button>
    </Tooltip>
  ),
}
export const TopStart: T = {
  render: () => (
    <Tooltip content="Top start" position="topStart">
      <Button variant="soft">Top start</Button>
    </Tooltip>
  ),
}
export const TopEnd: T = {
  render: () => (
    <Tooltip content="Top end" position="topEnd">
      <Button variant="soft">Top end</Button>
    </Tooltip>
  ),
}
export const BottomCenter: T = {
  render: () => (
    <Tooltip content="Bottom center" position="bottomCenter">
      <Button variant="soft">Bottom center</Button>
    </Tooltip>
  ),
}
export const ReducedMotion: T = {
  render: () => (
    <Tooltip content="Instant tooltip" delay={0}>
      <Button variant="outline">No delay</Button>
    </Tooltip>
  ),
}