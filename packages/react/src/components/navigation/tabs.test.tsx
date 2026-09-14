import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Tabs } from './Tabs'
describe('Tabs', () => {
  it('renders tablist/tab/tabpanel with aria-selected', () => {
    render(<Tabs.Root defaultValue="a"><Tabs.List><Tabs.Trigger value="a">A</Tabs.Trigger><Tabs.Trigger value="b">B</Tabs.Trigger></Tabs.List><Tabs.Panel value="a">Content A</Tabs.Panel></Tabs.Root>)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toBeInTheDocument()
  })
})