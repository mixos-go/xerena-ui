import { describe, it, expect } from 'vitest'
import { act, render, screen } from '@testing-library/react'
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
    const user = userEvent.setup()
    render(<Tabs.Root defaultValue="a"><Tabs.List><Tabs.Trigger value="a">A</Tabs.Trigger><Tabs.Trigger value="b">B</Tabs.Trigger></Tabs.List><Tabs.Panel value="a">Content A</Tabs.Panel></Tabs.Root>)
    expect(document.querySelectorAll('.xr-tabs__indicator')).toHaveLength(1)
    await user.click(screen.getByRole('tab', { name: 'B' }))
    expect(document.querySelectorAll('.xr-tabs__indicator')).toHaveLength(1)
  })
  it('moves focus roving between triggers with arrows and activates on Enter', async () => {
    const user = userEvent.setup()
    render(<Tabs.Root defaultValue="a"><Tabs.List><Tabs.Trigger value="a">A</Tabs.Trigger><Tabs.Trigger value="b">B</Tabs.Trigger><Tabs.Trigger value="c">C</Tabs.Trigger></Tabs.List></Tabs.Root>)
    const a = screen.getByRole('tab', { name: 'A' })
    const b = screen.getByRole('tab', { name: 'B' })
    const c = screen.getByRole('tab', { name: 'C' })
    expect(a).toHaveAttribute('tabindex', '0')
    expect(b).toHaveAttribute('tabindex', '-1')
    act(() => { a.focus() })
    await user.keyboard('{ArrowRight}')
    expect(b).toHaveFocus()
    expect(b).toHaveAttribute('tabindex', '0')
    expect(a).toHaveAttribute('tabindex', '-1')
    await user.keyboard('{ArrowRight}')
    expect(c).toHaveFocus()
    await user.keyboard('{Home}')
    expect(a).toHaveFocus()
    await user.keyboard('{End}')
    expect(c).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(b).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(b).toHaveAttribute('aria-selected', 'true')
    expect(b).toHaveAttribute('tabindex', '0')
  })
})