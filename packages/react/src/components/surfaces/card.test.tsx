import { render, screen } from '@testing-library/react'
import { Card } from './Card'
describe('Card', () => {
  it('applies variant, padding, and focus-visible for interactive', () => {
    render(<Card variant="interactive" padding="md">c</Card>)
    const el = screen.getByText('c')
    expect(el).toHaveClass('xr-card', 'xr-card--interactive')
    expect(el.style.padding).toBe('16px')
  })
})
