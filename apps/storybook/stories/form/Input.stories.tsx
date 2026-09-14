import type { Meta, StoryObj } from '@storybook/react'
import { Input, Provider, Stack } from '@xerena/react'

const meta: Meta<typeof Input> = {
  title: 'Form/Input',
  component: Input,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Input>

export const Outlined: T = { args: { placeholder: 'Placeholder' } }
export const Filled: T = { args: { variant: 'filled', placeholder: 'Placeholder' } }
export const WithLabel: T = {
  render: () => (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      Email
      <Input placeholder="you@example.com" />
    </label>
  ),
}
export const WithError: T = { args: { error: true, defaultValue: 'not-an-email', 'aria-label': 'Email' } }
export const Disabled: T = { args: { disabled: true, placeholder: 'Disabled' } }
export const ReadOnly: T = { args: { readOnly: true, value: 'Read only value' } }
export const Password: T = { args: { type: 'password', defaultValue: 'secret', 'aria-label': 'Password' } }
export const Dark: T = {
  render: () => (
    <Provider theme={{ mode: 'dark' }}>
      <Stack orientation="vertical" spacing="sm">
        <Input placeholder="Outlined" />
        <Input variant="filled" placeholder="Filled" />
        <Input error defaultValue="Invalid value" aria-label="Email" />
      </Stack>
    </Provider>
  ),
}