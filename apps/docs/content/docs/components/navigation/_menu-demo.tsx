'use client'

import { useState } from 'react'
import { Menu } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Menu.Root>
  <Menu.Trigger>
    <button type="button">Account</button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Label>Account</Menu.Label>
    <Menu.Item onClick={() => setChoice('Profile')}>Profile</Menu.Item>
    <Menu.Item onClick={() => setChoice('Billing')}>Billing</Menu.Item>
    <Menu.Separator />
    <Menu.Item onClick={() => setChoice('Sign out')}>Sign out</Menu.Item>
  </Menu.Content>
</Menu.Root>`

export function MenuDemo() {
  const [choice, setChoice] = useState('Profile')
  return (
    <Preview title="Account menu" code={code}>
      <Menu.Root>
        <Menu.Trigger>
          <button type="button">Account</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Label>Account</Menu.Label>
          <Menu.Item onClick={() => setChoice('Profile')}>Profile</Menu.Item>
          <Menu.Item onClick={() => setChoice('Billing')}>Billing</Menu.Item>
          <Menu.Separator />
          <Menu.Item onClick={() => setChoice('Sign out')}>Sign out</Menu.Item>
        </Menu.Content>
      </Menu.Root>
      <p>Selected: {choice}</p>
    </Preview>
  )
}
