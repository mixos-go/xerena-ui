import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IconButton } from './IconButton'
describe('IconButton', () => {
  it('requires aria-label', () => {
    render(<IconButton aria-label="Close">×</IconButton>)
    expect(screen.getByLabelText('Close')).toHaveClass('xr-iconbutton', 'xr-button--primary')
  })
})