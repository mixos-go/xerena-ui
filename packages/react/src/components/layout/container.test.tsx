import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Container } from './Container'
describe('Container', () => {
  it('renders centered md container with max-width token', () => {
    render(<Container size="md">c</Container>)
    expect(screen.getByText('c')).toHaveClass('xr-container', 'xr-container--md')
    expect(screen.getByText('c').style.maxWidth).toBe('768px')
  })
})
