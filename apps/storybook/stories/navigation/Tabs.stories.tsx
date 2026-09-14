import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, Text } from '@xerena/react'

const meta: Meta<typeof Tabs.Root> = {
  title: 'Navigation/Tabs',
  component: Tabs.Root,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Tabs.Root>

const Panels = () => (
  <>
    <Tabs.Panel value="overview">
      <Text>Overview panel content.</Text>
    </Tabs.Panel>
    <Tabs.Panel value="activity">
      <Text>Activity panel content.</Text>
    </Tabs.Panel>
    <Tabs.Panel value="settings">
      <Text>Settings panel content.</Text>
    </Tabs.Panel>
  </>
)

export const Underline: T = {
  render: () => (
    <Tabs.Root defaultValue="overview" variant="underline">
      <Tabs.List>
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>
      <Panels />
    </Tabs.Root>
  ),
}
export const Pill: T = {
  render: () => (
    <Tabs.Root defaultValue="overview" variant="pill">
      <Tabs.List>
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>
      <Panels />
    </Tabs.Root>
  ),
}
export const Enclosed: T = {
  render: () => (
    <Tabs.Root defaultValue="overview" variant="enclosed">
      <Tabs.List>
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>
      <Panels />
    </Tabs.Root>
  ),
}
export const WithDisabled: T = {
  render: () => (
    <Tabs.Root defaultValue="overview" variant="underline">
      <Tabs.List>
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="activity" disabled>Activity</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>
      <Panels />
    </Tabs.Root>
  ),
}
export const Controlled: T = {
  render: () => {
    const [value, setValue] = useState('overview')
    return <Tabs.Root value={value} onValueChange={setValue} variant="pill"><Tabs.List><Tabs.Trigger value="overview">Overview</Tabs.Trigger><Tabs.Trigger value="activity">Activity</Tabs.Trigger></Tabs.List><Panels /></Tabs.Root>
  },
}