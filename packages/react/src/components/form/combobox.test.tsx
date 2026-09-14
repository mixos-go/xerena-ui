import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
})