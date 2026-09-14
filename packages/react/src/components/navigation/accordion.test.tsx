import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Accordion } from './Accordion'
describe('Accordion', () => {
  it('renders header with aria-expanded', () => {
    render(<Accordion.Root type="single"><Accordion.Item value="a"><Accordion.Header><Accordion.Trigger value="a">Q</Accordion.Trigger></Accordion.Header><Accordion.Content value="a">A</Accordion.Content></Accordion.Item></Accordion.Root>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })
})