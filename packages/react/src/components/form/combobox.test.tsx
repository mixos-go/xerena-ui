import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Combobox } from './Combobox'
describe('Combobox', () => {
  it('renders combobox with aria-expanded', () => {
    render(
      <Combobox.Root>
        <Combobox.Input placeholder="Search" />
        <Combobox.List open={false}><Combobox.Option value="one">One</Combobox.Option></Combobox.List>
      </Combobox.Root>
    )
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
  })
  it('navigates options with arrows via aria-activedescendant, selects with Enter and closes with Escape', async () => {
    const user = userEvent.setup()
    render(
      <Combobox.Root>
        <Combobox.Input placeholder="Search" />
        <Combobox.List>
          <Combobox.Option value="one">One</Combobox.Option>
          <Combobox.Option value="two">Two</Combobox.Option>
          <Combobox.Option value="three">Three</Combobox.Option>
        </Combobox.List>
      </Combobox.Root>
    )
    const input = screen.getByRole('combobox')
    await user.click(input)
    await user.keyboard('{ArrowDown}')
    const options = () => Array.from(document.querySelectorAll<HTMLElement>('[role="option"]'))
    const opts = options()
    expect(opts).toHaveLength(3)
    expect(input.getAttribute('aria-activedescendant')).toEqual(opts[0]!.id)
    await user.keyboard('{ArrowDown}')
    expect(input.getAttribute('aria-activedescendant')).toEqual(opts[1]!.id)
    expect(opts[1]).toHaveAttribute('data-active', 'true')
    await user.keyboard('{ArrowDown}')
    expect(input.getAttribute('aria-activedescendant')).toEqual(opts[2]!.id)
    await user.keyboard('{Home}')
    expect(input.getAttribute('aria-activedescendant')).toEqual(opts[0]!.id)
    await user.keyboard('{End}')
    expect(input.getAttribute('aria-activedescendant')).toEqual(opts[2]!.id)
    await user.keyboard('{Enter}')
    expect(input).toHaveAttribute('aria-expanded', 'false')
    await user.keyboard('{ArrowDown}')
    expect(input).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })
})
