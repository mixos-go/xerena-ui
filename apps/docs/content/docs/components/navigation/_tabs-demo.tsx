'use client'

import { useState } from 'react'
import { Tabs } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Tabs.Root value={tab} onValueChange={setTab} variant="underline">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="overview">Overview content.</Tabs.Panel>
  <Tabs.Panel value="activity">Activity content.</Tabs.Panel>
</Tabs.Root>`

export function TabsDemo() {
  const [tab, setTab] = useState('overview')
  return (
    <Preview title="Switch tabs" code={code}>
      <Tabs.Root value={tab} onValueChange={setTab} variant="underline">
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="overview">Overview content.</Tabs.Panel>
        <Tabs.Panel value="activity">Activity content.</Tabs.Panel>
      </Tabs.Root>
      <p>Active: {tab}</p>
    </Preview>
  )
}
