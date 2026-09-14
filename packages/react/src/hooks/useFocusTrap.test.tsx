import { createElement, type RefObject } from 'react'
import { render } from '@testing-library/react'
import { useFocusTrap } from './useFocusTrap'
describe('useFocusTrap', () => {
  it('focuses the first element when opened', () => {
    const Probe = () => {
      const ref = useFocusTrap(true) as RefObject<HTMLDivElement | null>
      return (
        <div ref={ref}>
          <button>A</button>
          <button>B</button>
        </div>
      )
    }
    const { getByRole } = render(createElement(Probe))
    expect(document.activeElement).toBe(getByRole('button', { name: 'A' }))
  })
})
