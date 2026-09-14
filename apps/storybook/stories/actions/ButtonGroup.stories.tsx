import type { Meta, StoryObj } from '@storybook/react'
import { Button, ButtonGroup } from '@xerena/react'

const meta: Meta<typeof ButtonGroup> = {
  title: 'Actions/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof ButtonGroup>

export const Horizontal: T = {
  args: {
    orientation: 'horizontal',
    spacing: 'sm',
    children: (
      <>
        <Button>Save</Button>
        <Button variant="outline">Cancel</Button>
      </>
    ),
  },
}
export const Vertical: T = {
  args: {
    orientation: 'vertical',
    spacing: 'sm',
    children: (
      <>
        <Button>Save</Button>
        <Button variant="outline">Cancel</Button>
      </>
    ),
  },
}