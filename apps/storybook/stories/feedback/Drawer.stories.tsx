import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Button, Drawer, Stack } from '@xerena/react'

const meta: Meta<typeof Drawer.Root> = {
  title: 'Feedback/Drawer',
  component: Drawer.Root,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Drawer.Root>

const content = (
  <Stack spacing="md">
    <strong>Drawer content</strong>
    <span>Panels slide in from the chosen edge.</span>
  </Stack>
)

export const Right: T = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open right</Button>
        <Drawer.Root open={open} onClose={() => setOpen(false)} side="right" size="md">
          <Drawer.Content>{content}</Drawer.Content>
        </Drawer.Root>
      </>
    )
  },
}
export const Left: T = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open left</Button>
        <Drawer.Root open={open} onClose={() => setOpen(false)} side="left" size="md">
          <Drawer.Content>{content}</Drawer.Content>
        </Drawer.Root>
      </>
    )
  },
}
export const Top: T = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open top</Button>
        <Drawer.Root open={open} onClose={() => setOpen(false)} side="top" size="sm">
          <Drawer.Content>{content}</Drawer.Content>
        </Drawer.Root>
      </>
    )
  },
}
export const Bottom: T = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open bottom</Button>
        <Drawer.Root open={open} onClose={() => setOpen(false)} side="bottom" size="sm">
          <Drawer.Content>{content}</Drawer.Content>
        </Drawer.Root>
      </>
    )
  },
}
export const LargeSize: T = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open large drawer</Button>
        <Drawer.Root open={open} onClose={() => setOpen(false)} side="right" size="lg">
          <Drawer.Content>{content}</Drawer.Content>
        </Drawer.Root>
      </>
    )
  },
}