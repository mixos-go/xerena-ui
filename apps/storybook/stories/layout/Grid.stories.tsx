import type { Meta, StoryObj } from '@storybook/react'
import { Grid, Text } from '@xerena/react'

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Grid>

const Cell = ({ label }: { label: string }) => (
  <Text style={{ padding: '12px', border: '1px solid var(--xr-semantic-color-border)', borderRadius: 'var(--xr-radius-md)', textAlign: 'center' }}>
    {label}
  </Text>
)

export const Auto: T = {
  render: () => (
    <Grid auto gap="md">
      <Cell label="A" />
      <Cell label="B" />
      <Cell label="C" />
      <Cell label="D" />
    </Grid>
  ),
}
export const ThreeColumns: T = {
  render: () => (
    <Grid columns={3} gap="md">
      <Cell label="A" />
      <Cell label="B" />
      <Cell label="C" />
      <Cell label="D" />
    </Grid>
  ),
}
export const SixColumns: T = {
  render: () => (
    <Grid columns={6} gap="sm">
      <Cell label="A" />
      <Cell label="B" />
      <Cell label="C" />
    </Grid>
  ),
}
export const LargeGap: T = {
  render: () => (
    <Grid columns={2} gap="xl">
      <Cell label="A" />
      <Cell label="B" />
    </Grid>
  ),
}