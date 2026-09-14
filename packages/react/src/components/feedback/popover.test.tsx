import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Popover } from './Popover'

describe('Popover', () => {
  it('renders content in portal when open', async () => {
    render(<Popover.Root open><Popover.Trigger><button>Go</button></Popover.Trigger><Popover.Content>Panel</Popover.Content></Popover.Root>)
    await userEvent.click(screen.getByText('Go'))
    expect(screen.getByText('Panel')).toBeInTheDocument()
  })
})