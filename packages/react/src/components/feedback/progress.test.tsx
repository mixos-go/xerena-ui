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
})