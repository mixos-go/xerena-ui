import { render, screen } from '@testing-library/react'
import { OverlayPrimitive } from './OverlayPrimitive'

describe('OverlayPrimitive', () => {
  it('portals children into body when open and removes on close', () => {
    const { rerender } = render(
      <OverlayPrimitive open onClose={() => {}}>
        <div>overlay</div>
      </OverlayPrimitive>,
    )
    expect(screen.getByText('overlay')).toBeInTheDocument()
    rerender(
      <OverlayPrimitive open={false} onClose={() => {}}>
        <div>overlay</div>
      </OverlayPrimitive>,
    )
    expect(screen.queryByText('overlay')).not.toBeInTheDocument()
  })
  it('calls onClose on Escape', () => {
    const close = vi.fn()
    render(
      <OverlayPrimitive open onClose={close}>
        <div>o</div>
      </OverlayPrimitive>,
    )
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(close).toHaveBeenCalled()
  })
})