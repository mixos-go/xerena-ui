import { render } from '@testing-library/react'
import { useClassName } from './useClassName'
const C = (p: { className?: string }) => <div data-testid="x" className={useClassName(p)} />
it('uses explicit className when provided', () => {
  render(<C className="mine" />)
  expect(document.querySelector('[data-testid="x"]')).toHaveClass('mine')
})