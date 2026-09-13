import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Input } from './Input'
describe('Input', () => {
  it('renders with textbox role and base classes', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toHaveClass('xr-input', 'xr-input--outlined')
  })
  it('applies filled variant class', () => {
    render(<Input variant="filled" />)
    expect(screen.getByRole('textbox')).toHaveClass('xr-input--filled')
  })
  it('marks aria-invalid when error', () => {
    render(<Input error />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })
})