import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Skeleton } from './Skeleton'
describe('Skeleton', () => {
  it('renders line skeleton with role status wrapper', () => {
    const { container } = render(<Skeleton shape="line" width={100} height={12} />)
    expect(container.querySelector('.xr-skeleton')).not.toBeNull()
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull()
  })
})