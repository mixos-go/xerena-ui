import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { InputGroup } from './InputGroup'
describe('InputGroup', () => {
  it('renders container with xr-input-group class', () => {
    const { container } = render(<InputGroup><input aria-label="Field" /></InputGroup>)
    expect(container.firstChild).toHaveClass('xr-input-group')
  })
})
