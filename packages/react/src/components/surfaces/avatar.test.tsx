import { render, screen } from '@testing-library/react'
import { Avatar } from './Avatar'
describe('Avatar', () => {
  it('renders initials fallback', () => {
    render(<Avatar variant="initials" initials="AB" />)
    expect(screen.getByText('AB')).toHaveClass('xr-avatar__initials')
  })
  it('applies size classes', () => {
    render(<Avatar variant="initials" initials="X" size="xl" />)
    const el = screen.getByText('X')
    expect(el.parentElement).toHaveClass('xr-avatar', 'xr-avatar--xl')
  })
})
