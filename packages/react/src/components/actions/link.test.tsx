import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Link } from './Link'
describe('Link', () => {
  it('renders animated underline class for animated variant', () => {
    render(<Link variant="animated" href="/p">Page</Link>)
    expect(screen.getByText('Page')).toHaveClass('xr-link', 'xr-link--animated')
  })
  it('respects target and rel', () => {
    render(<Link href="/e" target="_blank" rel="noopener noreferrer">ext</Link>)
    const a = screen.getByText('ext')
    expect(a).toHaveAttribute('target', '_blank')
    expect(a).toHaveAttribute('rel', 'noopener noreferrer')
  })
  it('renders asChild via Slot', () => {
    render(<Link asChild><span>span link</span></Link>)
    expect(screen.getByText('span link').tagName).toBe('SPAN')
    expect(screen.getByText('span link')).toHaveClass('xr-link')
  })
})
