import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Select } from './Select'
describe('Select', () => {
  it('renders with combobox role and xr-select class', () => {
    render(<Select><option>a</option></Select>)
    expect(screen.getByRole('combobox')).toHaveClass('xr-select')
  })
  it('disables when disabled', () => {
    render(<Select disabled><option>a</option></Select>)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })
})