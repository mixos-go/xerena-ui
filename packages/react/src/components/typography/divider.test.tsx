import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Divider } from './Divider'
describe('Divider', () => {
  it('renders horizontal separator', () => {
    render(<Divider />)
    expect(document.querySelector('[role="separator"]')).not.toBeNull()
  })
})
