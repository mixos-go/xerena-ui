import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  it('shows content on hover', async () => {
    render(<Tooltip content="Hint"><button>Btn</button></Tooltip>)
    expect(screen.queryByText('Hint')).not.toBeInTheDocument()
    await userEvent.hover(screen.getByText('Btn'))
    expect(await screen.findByText('Hint')).toBeInTheDocument()
    expect(screen.getByRole('tooltip')).toHaveAttribute('aria-label', 'Hint')
  })
})