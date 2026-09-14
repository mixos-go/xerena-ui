import type { Meta, StoryObj } from '@storybook/react'
import { Accordion, Text } from '@xerena/react'

const meta: Meta<typeof Accordion.Root> = {
  title: 'Navigation/Accordion',
  component: Accordion.Root,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Accordion.Root>

const Item = ({ value, title, body }: { value: string; title: string; body: string }) => (
  <Accordion.Item value={value}>
    <Accordion.Header>
      <Accordion.Trigger value={value}>{title}</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content value={value}>{body}</Accordion.Content>
  </Accordion.Item>
)

export const Single: T = {
  render: () => (
    <Accordion.Root type="single">
      <Item value="one" title="What is Xerena?" body="A calm, token-driven component kit." />
      <Item value="two" title="How do I install it?" body="Add the package and import the styles." />
      <Item value="three" title="Is it accessible?" body="Every component ships with roles and aria." />
    </Accordion.Root>
  ),
}
export const Multiple: T = {
  render: () => (
    <Accordion.Root type="multiple">
      <Item value="one" title="Section one" body="Content for section one." />
      <Item value="two" title="Section two" body="Content for section two." />
    </Accordion.Root>
  ),
}
export const DefaultOpen: T = {
  render: () => (
    <Accordion.Root type="single" defaultValue={['one']}>
      <Item value="one" title="Open by default" body="This section starts expanded." />
      <Item value="two" title="Closed section" body="This section starts collapsed." />
    </Accordion.Root>
  ),
}
export const ReducedMotion: T = {
  render: () => (
    <Accordion.Root type="single" defaultValue={['one']}>
      <Item value="one" title="Section one" body="Content without transition." />
      <Item value="two" title="Section two" body="Content without transition." />
    </Accordion.Root>
  ),
}