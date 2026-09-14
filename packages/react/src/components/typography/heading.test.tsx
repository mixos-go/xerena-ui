import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Heading } from './Heading'
describe('Heading', () => {
  it('renders the requested heading level', () => {
    render(<Heading as="h2">Title</Heading>)
    const h = screen.getByText('Title')
    expect(h.tagName).toBe('H2')
    expect(h).toHaveClass('xr-heading', 'xr-heading--h2')
  })
})
