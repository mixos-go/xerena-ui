import { render, screen } from '@testing-library/react'
import { Progress } from './Progress'

describe('Progress', () => {
  it('bar: renders role=progressbar with correct value', () => {
    render(<Progress value={45} label="Upload progress" />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '45')
    expect(bar).toHaveAttribute('aria-label', 'Upload progress')
  })
  it('circle: renders svg-based ring', () => {
    render(<Progress variant="circle" value={70} />)
    const bar = screen.getByRole('progressbar')
    expect(bar.querySelector('svg circle')).not.toBeNull()
  })
  it('circle: always applies strokeDashoffset so the ring does not paint full on mount', () => {
    render(<Progress variant="circle" value={30} />)
    const ring = document.querySelector('.xr-progress__circle')
    expect(ring).not.toBeNull()
    expect(Number((ring as SVGCircleElement).getAttribute('stroke-dashoffset'))).toBeGreaterThan(0)
  })
  it('pageTop: renders fixed-position bar', () => {
    render(<Progress variant="pageTop" value={20} />)
    const bar = screen.getByRole('progressbar')
    expect(bar.style.position).toBe('fixed')
    expect(bar.style.top).toBe('0px')
  })
  it('mouse: renders aria-hidden cursor-following ring', () => {
    render(<Progress variant="mouse" value={60} />)
    const bar = screen.getByRole('progressbar', { hidden: true })
    expect(bar).toHaveAttribute('aria-hidden', 'true')
    expect(bar.querySelector('.xr-progress__ring')).not.toBeNull()
  })
  it('mouse: rings track from the viewport origin zero-size container', () => {
    render(<Progress variant="mouse" value={60} />)
    const bar = screen.getByRole('progressbar', { hidden: true })
    expect(bar.style.position).toBe('fixed')
    expect(bar.style.top).toBe('0px')
    expect(bar.style.left).toBe('0px')
    expect(bar.style.width).toBe('0px')
    expect(bar.style.height).toBe('0px')
  })
})
