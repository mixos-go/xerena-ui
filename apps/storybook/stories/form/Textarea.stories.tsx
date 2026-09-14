import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from '@xerena/react'

const meta: Meta<typeof Textarea> = {
  title: 'Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Textarea>

export const Default: T = { args: { placeholder: 'Write something...', rows: 3 } }
export const ResizeNone: T = { args: { resize: 'none', defaultValue: 'This textarea cannot be resized.', rows: 3 } }
export const ResizeAuto: T = { args: { resize: 'auto', defaultValue: 'This textarea can be resized vertically.', rows: 3 } }
export const WithError: T = { args: { error: true, defaultValue: 'Bad input', rows: 3 } }
export const Disabled: T = { args: { disabled: true, placeholder: 'Disabled', rows: 3 } }