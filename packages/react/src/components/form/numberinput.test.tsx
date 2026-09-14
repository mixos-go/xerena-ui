import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NumberInput } from './NumberInput'
describe('NumberInput', () => {
  it('renders spinbutton with value in aria-valuenow', () => {
    render(<NumberInput value={5} />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-valuenow', '5')
  })
  it('renders stepper buttons in compact variant', () => {
    render(<NumberInput value={5} variant="compact" />)
    expect(screen.getByLabelText('Increase')).toBeInTheDocument()
    expect(screen.getByLabelText('Decrease')).toBeInTheDocument()
  })
})