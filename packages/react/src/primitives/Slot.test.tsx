import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Slot } from './Slot'
describe('Slot', () => {
  it('merges props onto child element', () => {
    render(<Slot as="button" data-testid="slot" aria-label="hi"><span>go</span></Slot>)
    const el = screen.getByTestId('slot')
    expect(el.tagName).toBe('SPAN')
    expect(el).toHaveAttribute('aria-label', 'hi')
  })
  it('combines className from both parent and child', () => {
    render(<Slot className="xr-parent"><button className="xr-child">b</button></Slot>)
    expect(screen.getByRole('button')).toHaveClass('xr-parent', 'xr-child')
  })
})
