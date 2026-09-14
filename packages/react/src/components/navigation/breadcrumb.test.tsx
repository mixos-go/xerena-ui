import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Breadcrumb } from './Breadcrumb'
describe('Breadcrumb', () => {
  it('renders with aria-label and aria-current on last item', () => {
    render(<nav aria-label="Breadcrumb"><Breadcrumb.Item href="/">Home</Breadcrumb.Item><Breadcrumb.Item href="/a">A</Breadcrumb.Item><Breadcrumb.Item current>Current</Breadcrumb.Item></nav>)
    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument()
    expect(screen.getByText('Current')).toHaveAttribute('aria-current', 'page')
  })
})