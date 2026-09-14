import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs } from './Tabs'
describe('Tabs', () => {
  it('renders tablist/tab/tabpanel with aria-selected', () => {
    render(<Tabs.Root defaultValue="a"><Tabs.List><Tabs.Trigger value="a">A</Tabs.Trigger><Tabs.Trigger value="b">B</Tabs.Trigger></Tabs.List><Tabs.Panel value="a">Content A</Tabs.Panel></Tabs.Root>)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toBeInTheDocument()
  })
  it('wires the trigger id to the panel aria-labelledby', () => {
    render(<Tabs.Root defaultValue="a"><Tabs.List><Tabs.Trigger value="a">A</Tabs.Trigger></Tabs.List><Tabs.Panel value="a">Content A</Tabs.Panel></Tabs.Root>)
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('id', 'trigger-a')
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'trigger-a')
  })
  it('keeps a single indicator on the selected tab and clears it on switch', async () => {
    render(<Tabs.Root defaultValue="a"><Tabs.List><Tabs.Trigger value="a">A</Tabs.Trigger><Tabs.Trigger value="b">B</Tabs.Trigger></Tabs.List><Tabs.Panel value="a">Content A</Tabs.Panel></Tabs.Root>)
    expect(document.querySelectorAll('.xr-tabs__indicator')).toHaveLength(1)
    await userEvent.click(screen.getByRole('tab', { name: 'B' }))
    expect(document.querySelectorAll('.xr-tabs__indicator')).toHaveLength(1)
  })
})