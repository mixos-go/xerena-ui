import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CheckboxGroup } from './CheckboxGroup'
describe('CheckboxGroup', () => {
  it('renders a group container with its children', () => {
    render(<CheckboxGroup><span>c</span></CheckboxGroup>)
    expect(screen.getByRole('group')).toHaveTextContent('c')
  })
})