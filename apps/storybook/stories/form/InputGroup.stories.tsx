import type { Meta, StoryObj } from '@storybook/react'
import { Button, Input, InputGroup } from '@xerena/react'

const meta: Meta<typeof InputGroup> = {
  title: 'Form/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof InputGroup>

export const WithButton: T = {
  render: () => (
    <InputGroup>
      <Input placeholder="Search items" />
      <Button variant="primary">Search</Button>
    </InputGroup>
  ),
}
export const WithIcon: T = {
  render: () => (
    <InputGroup>
      <Input placeholder="Search" />
      <Button soft>⌕</Button>
    </InputGroup>
  ),
}
export const WithAddon: T = {
  render: () => (
    <InputGroup>
      <span style={{ padding: '0 12px', display: 'inline-flex', alignItems: 'center', background: 'var(--xr-semantic-color-surface)' }}>@</span>
      <Input placeholder="username" />
    </InputGroup>
  ),
}