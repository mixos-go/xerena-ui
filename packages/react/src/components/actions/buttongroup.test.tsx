import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ButtonGroup } from './ButtonGroup'
describe('ButtonGroup', () => {
  it('renders a horizontal group with gap', () => {
    render(<ButtonGroup spacing="md">a</ButtonGroup>)
    expect(screen.getByText('a')).toHaveClass('xr-button-group', 'xr-button-group--horizontal')
  })
})