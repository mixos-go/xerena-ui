import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Grid } from './Grid'
describe('Grid', () => {
  it('renders 3-column grid', () => {
    render(<Grid columns={3}>g</Grid>)
    expect(screen.getByText('g').style.gridTemplateColumns).toBe('repeat(3, minmax(0,1fr))')
  })
})
