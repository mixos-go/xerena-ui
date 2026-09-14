import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Slider } from './Slider'
describe('Slider', () => {
  it('renders aria slider with value in aria-valuenow', () => {
    render(<Slider value={40} min={0} max={100} />)
    const el = screen.getByRole('slider')
    expect(el).toHaveAttribute('aria-valuenow', '40')
    expect(el).toHaveAttribute('aria-valuemin', '0')
    expect(el).toHaveAttribute('aria-valuemax', '100')
  })
})
