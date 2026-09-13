import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { Checkbox } from './Checkbox'
describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false')
  })
  it('toggles on click', async () => {
    render(<Checkbox />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true')
  })
})