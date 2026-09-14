import type { Meta, StoryObj } from '@storybook/react'
import { Field, Input } from '@xerena/react'

const meta: Meta<typeof Field> = {
  title: 'Form/Field',
  component: Field,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Field>

export const Default: T = {
  args: { label: 'Email', children: <Input placeholder="you@example.com" /> },
}
export const WithHint: T = {
  args: { label: 'Password', hint: 'At least 8 characters', children: <Input type="password" placeholder="••••••••" /> },
}
export const WithError: T = {
  args: { label: 'Email', error: 'Email address is invalid', children: <Input placeholder="you@example.com" error /> },
}
export const Required: T = {
  args: { label: 'Name', required: true, children: <Input placeholder="Jane Doe" /> },
}
export const Disabled: T = {
  args: { label: 'Email', children: <Input placeholder="you@example.com" disabled /> },
}