import type { Meta, StoryObj } from '@storybook/react'
import { Stack, Text } from '@xerena/react'

const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Stack>

const Box = ({ label }: { label: string }) => (
  <Text style={{ padding: '8px 16px', border: '1px solid var(--xr-semantic-color-border)', borderRadius: 'var(--xr-radius-md)' }}>
    {label}
  </Text>
)

export const Vertical: T = {
  render: () => (
    <Stack orientation="vertical" spacing="md">
      <Box label="One" />
      <Box label="Two" />
      <Box label="Three" />
    </Stack>
  ),
}
export const Horizontal: T = {
  render: () => (
    <Stack orientation="horizontal" spacing="md">
      <Box label="One" />
      <Box label="Two" />
      <Box label="Three" />
    </Stack>
  ),
}
export const Inline: T = {
  render: () => (
    <Stack orientation="inline" spacing="sm">
      <Box label="Inline 1" />
      <Box label="Inline 2" />
    </Stack>
  ),
}
export const LargeSpacing: T = {
  render: () => (
    <Stack orientation="vertical" spacing="xl">
      <Box label="One" />
      <Box label="Two" />
    </Stack>
  ),
}
export const CenteredItems: T = {
  render: () => (
    <Stack orientation="horizontal" spacing="md" alignItems="center" justifyContent="center">
      <Box label="One" />
      <Box label="Two" />
    </Stack>
  ),
}