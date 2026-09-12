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

  it('uses light sand face tones by default', () => {
    const { container } = render(<XerenaMark />)
    const stops = container.querySelectorAll('linearGradient stop')
    expect(stops[0]).toHaveAttribute('stop-color', '#f4efe6')
    expect(stops[1]).toHaveAttribute('stop-color', '#faf7f2')
  })

  it('applies the darker onDark face tones', () => {
    const { container } = render(<XerenaMark tone="onDark" />)
    const stops = container.querySelectorAll('linearGradient stop')
    expect(stops[0]).toHaveAttribute('stop-color', '#5a5245')
    expect(stops[1]).toHaveAttribute('stop-color', '#2b2620')
  })
})