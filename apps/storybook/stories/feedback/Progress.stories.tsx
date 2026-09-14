import type { Meta, StoryObj } from '@storybook/react'
import { Progress } from '@xerena/react'

const meta: Meta<typeof Progress> = {
  title: 'Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Progress>

export const Bar: T = { args: { value: 70, label: 'Upload progress' }, parameters: { layout: 'padded' } }
export const PageTop: T = { args: { value: 40, variant: 'pageTop', label: 'Page progress' }, parameters: { layout: 'fullscreen' } }
export const PageBottom: T = { args: { value: 60, variant: 'pageBottom', label: 'Page progress' }, parameters: { layout: 'fullscreen' } }
export const Circle: T = { args: { value: 75, variant: 'circle', size: 96, stroke: 8, label: 'Completion' } }
export const Mouse: T = { args: { value: 30, variant: 'mouse', label: 'Cursor progress' }, parameters: { layout: 'fullscreen' } }
export const ReducedMotion: T = { args: { value: 80, label: 'Upload progress' }, parameters: { layout: 'padded' } }