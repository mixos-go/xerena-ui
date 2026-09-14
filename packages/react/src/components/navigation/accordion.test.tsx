import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Accordion } from './Accordion'
describe('Accordion', () => {
  it('renders header with aria-expanded', () => {
    render(<Accordion.Root type="single"><Accordion.Item value="a"><Accordion.Header><Accordion.Trigger value="a">Q</Accordion.Trigger></Accordion.Header><Accordion.Content value="a">A</Accordion.Content></Accordion.Item></Accordion.Root>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })
  it('toggles item data-state on click', async () => {
    const user = userEvent.setup()
    render(<Accordion.Root type="single"><Accordion.Item value="a"><Accordion.Header><Accordion.Trigger value="a">Q1</Accordion.Trigger></Accordion.Header><Accordion.Content value="a">A1</Accordion.Content></Accordion.Item><Accordion.Item value="b"><Accordion.Header><Accordion.Trigger value="b">Q2</Accordion.Trigger></Accordion.Header><Accordion.Content value="b">A2</Accordion.Content></Accordion.Item></Accordion.Root>)
    const items = document.querySelectorAll<HTMLElement>('.xr-accordion__item')
    expect(items[0]).toHaveAttribute('data-state', 'closed')
    expect(items[1]).toHaveAttribute('data-state', 'closed')
    await user.click(screen.getByRole('button', { name: /Q1/ }))
    expect(items[0]).toHaveAttribute('data-state', 'open')
    expect(screen.getByText('A1')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Q2/ }))
    expect(items[0]).toHaveAttribute('data-state', 'closed')
    expect(items[1]).toHaveAttribute('data-state', 'open')
  })
})