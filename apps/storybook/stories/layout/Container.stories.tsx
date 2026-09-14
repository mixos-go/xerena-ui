import type { Meta, StoryObj } from '@storybook/react'
import { Container, Stack, Text } from '@xerena/react'

const Boxes = () => (
  <Stack spacing="sm">
    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
    <Text variant="muted">Container content goes here.</Text>
  </Stack>
)

const meta: Meta<typeof Container> = {
  title: 'Layout/Container',
  component: Container,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Container>

export const Centered: T = { args: { variant: 'centered', size: 'lg', children: <Boxes /> } }
export const Fluid: T = { args: { variant: 'fluid', children: <Boxes /> }, parameters: { layout: 'padded' } }
export const Narrow: T = { args: { variant: 'narrow', children: <Boxes /> } }
export const SmallSize: T = { args: { size: 'sm', children: <Boxes /> } }
export const XlSize: T = { args: { size: 'xl', children: <Boxes /> } }