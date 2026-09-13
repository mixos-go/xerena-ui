import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Kbd } from './Kbd'
describe('Kbd', () => {
  it('renders a kbd element', () => {
    render(<Kbd>⌘K</Kbd>)
    expect(document.querySelector('kbd')).toHaveClass('xr-kbd')
  })
})