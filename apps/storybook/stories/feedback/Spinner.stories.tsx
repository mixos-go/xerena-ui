import type { Meta, StoryObj } from '@storybook/react'
import { Spinner, Stack } from '@xerena/react'

const meta: Meta<typeof Spinner> = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Spinner>

export const Default: T = { args: {} }
export const Small: T = { args: { size: 'sm' } }
export const Large: T = { args: { size: 'lg' } }
export const CustomLabel: T = { args: { label: 'Fetching data' } }
export const Sizes: T = {
  render: () => (
    <Stack orientation="horizontal" spacing="lg" alignItems="center">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </Stack>
  ),
}