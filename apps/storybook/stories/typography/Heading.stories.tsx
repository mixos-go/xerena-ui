import type { Meta, StoryObj } from '@storybook/react'
import { Heading } from '@xerena/react'

const meta: Meta<typeof Heading> = {
  title: 'Typography/Heading',
  component: Heading,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Heading>

export const H1: T = { args: { as: 'h1', children: 'Heading one' } }
export const H2: T = { args: { as: 'h2', children: 'Heading two' } }
export const H3: T = { args: { as: 'h3', children: 'Heading three' } }
export const H4: T = { args: { as: 'h4', children: 'Heading four' } }
export const H5: T = { args: { as: 'h5', children: 'Heading five' } }
export const H6: T = { args: { as: 'h6', children: 'Heading six' } }
export const AsChild: T = {
  args: { asChild: true, children: <a href="https://example.com">linked heading</a> },
}