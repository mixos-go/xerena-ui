import { render, screen } from '@testing-library/react'
import { Switch } from './Switch'
describe('Switch', () => {
  it('passes size to thumb translate var', () => {
    render(<Switch size="md" />)
    const sw = screen.getByRole('switch')
    expect(sw.style.getPropertyValue('--xr-switch-thumb')).toBe('32px')
  })
})