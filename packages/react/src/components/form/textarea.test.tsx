import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Textarea } from './Textarea'
describe('Textarea', () => {
  it('renders with xr-textarea class', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox')).toHaveClass('xr-textarea')
  })
  it('respects rows and resize', () => {
    render(<Textarea rows={4} resize="auto" />)
    const ta = screen.getByRole('textbox')
    expect(ta).toHaveAttribute('rows', '4')
    expect(ta).toHaveStyle({ resize: 'auto' })
  })
})