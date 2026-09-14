import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'
describe('Badge', () => {
  it('renders tone and size classes', () => {
    render(<Badge tone="success">Done</Badge>)
    const b = screen.getByText('Done')
    expect(b).toHaveClass('xr-badge', 'xr-badge--success')
    expect(b).toHaveStyle({ backgroundColor: 'var(--xr-semantic-color-successSurface)' })
  })
})
