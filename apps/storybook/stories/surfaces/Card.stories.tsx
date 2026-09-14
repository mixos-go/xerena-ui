import type { Meta, StoryObj } from '@storybook/react'
import { Card, Provider, Stack, Text } from '@xerena/react'

const meta: Meta<typeof Card> = {
  title: 'Surfaces/Card',
  component: Card,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Card>

const CardContent = () => (
  <Stack spacing="xs">
    <Text variant="strong">Getting started</Text>
    <Text variant="muted" size="sm">Pull the latest component kit and follow the setup guide.</Text>
  </Stack>
)

export const Outlined: T = { args: { variant: 'outlined', children: <CardContent /> } }
export const Elevated: T = { args: { variant: 'elevated', children: <CardContent /> } }
export const Soft: T = { args: { variant: 'soft', children: <CardContent /> } }
export const Interactive: T = { args: { variant: 'interactive', children: <CardContent /> } }
export const Flat: T = { args: { variant: 'flat', children: <CardContent /> } }
export const LargePadding: T = { args: { variant: 'outlined', padding: 'xl', children: <CardContent /> } }
export const Dark: T = {
  render: () => (
    <Provider theme={{ mode: 'dark' }}>
      <Stack orientation="horizontal" spacing="md">
        <Card variant="outlined"><CardContent /></Card>
        <Card variant="elevated"><CardContent /></Card>
        <Card variant="interactive"><CardContent /></Card>
      </Stack>
    </Provider>
  ),
}