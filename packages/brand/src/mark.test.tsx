import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { XerenaMark } from './mark'

describe('XerenaMark', () => {
  it('renders an identifiable mark', () => {
    render(<XerenaMark />)
    expect(screen.getByRole('img', { name: 'Xerena' })).toBeInTheDocument()
  })

  it('honours a custom title', () => {
    render(<XerenaMark title="Xerena logo" />)
    expect(screen.getByRole('img', { name: 'Xerena logo' })).toBeInTheDocument()
  })

  it('maps sizes to pixel dimensions', () => {
    const { container } = render(<XerenaMark size="lg" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '48')
    expect(svg).toHaveAttribute('height', '48')
  })
})