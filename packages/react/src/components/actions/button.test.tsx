import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './Button'
describe('Button', () => {
  it('renders primary variant by default with correct aria attributes', () => {
    render(<Button>Click</Button>)
    const btn = screen.getByRole('button', { name: 'Click' })
    expect(btn).toHaveClass('xr-button', 'xr-button--primary', 'xr-button--md')
    expect(btn.tagName).toBe('BUTTON')
    expect(btn).toHaveAttribute('type', 'button')
  })
  it('applies animated class when animated is set', () => {
    render(<Button animated>Go</Button>)
    expect(screen.getByText('Go')).toHaveClass('xr-button--animated')
  })
  it('shows aria-busy when loading', () => {
    render(<Button loading>Save</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
  })
  it('wires leftIcon and rightIcon around children', () => {
    render(<Button leftIcon={<span>←</span>} rightIcon={<span>→</span>}>Go</Button>)
    expect(screen.getByText('←')).toBeInTheDocument()
    expect(screen.getByText('→')).toBeInTheDocument()
  })
  it('renders as anchor via asChild', () => {
    render(<Button asChild><a href="/go">Go</a></Button>)
    expect(screen.getByText('Go').tagName).toBe('A')
  })
})