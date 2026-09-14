import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ButtonGroup } from './ButtonGroup'
import { Button } from './Button'
describe('ButtonGroup', () => {
  it('renders a horizontal group with gap', () => {
    render(<ButtonGroup spacing="md">a</ButtonGroup>)
    expect(screen.getByText('a')).toHaveClass('xr-button-group', 'xr-button-group--horizontal')
  })
  it('selects child buttons keyed by value and calls onValueChange', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<ButtonGroup onValueChange={onValueChange}><Button value="a" variant="outline">A</Button><Button value="b" variant="outline">B</Button></ButtonGroup>)
    expect(screen.getByRole('button', { name: 'A' })).not.toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'B' }))
    expect(onValueChange).toHaveBeenCalledWith('b')
    expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'B' })).toHaveClass('xr-button--selected')
  })
  it('respects controlled value', () => {
    render(<ButtonGroup value="a"><Button value="a">A</Button><Button value="b">B</Button></ButtonGroup>)
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-pressed', 'true')
  })
})
