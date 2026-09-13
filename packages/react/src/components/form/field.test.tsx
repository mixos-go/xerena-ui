import { render, screen } from '@testing-library/react'
import { Field } from './Field'
import { Input } from './Input'
describe('Field', () => {
  it('auto-assigns htmlFor/id between label and input', () => {
    render(<Field label="Email" htmlFor="email"><Input id="email" /></Field>)
    expect(screen.getByLabelText('Email').tagName).toBe('INPUT')
  })
  it('renders error message with danger color', () => {
    render(<Field label="Name" error="Required"><Input /></Field>)
    expect(screen.getByText('Required')).toHaveClass('xr-field__error')
  })
})