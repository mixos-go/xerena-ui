import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Radio } from './Radio'
describe('Radio', () => {
  it('renders with xr-radio class and unchecked aria', () => {
    render(<Radio checked={false} />)
    expect(screen.getByRole('radio')).toHaveClass('xr-radio')
    expect(screen.getByRole('radio')).toHaveAttribute('aria-checked', 'false')
  })
  it('reflects checked state', () => {
    render(<Radio checked />)
    expect(screen.getByRole('radio')).toHaveAttribute('aria-checked', 'true')
  })
})