import type { Meta, StoryObj } from '@storybook/react'
import { Select } from '@xerena/react'

const meta: Meta<typeof Select> = {
  title: 'Form/Select',
  component: Select,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Select>

const Options = (
  <>
    <option value="react">React</option>
    <option value="vue">Vue</option>
    <option value="svelte">Svelte</option>
  </>
)

export const Default: T = { args: { children: Options, defaultValue: 'react', 'aria-label': 'Framework' } }
export const WithError: T = { args: { error: true, children: Options, defaultValue: '', 'aria-label': 'Framework' } }
export const Disabled: T = { args: { disabled: true, children: Options, defaultValue: 'react', 'aria-label': 'Framework' } }
export const Multiple: T = {
  args: { multiple: true, children: Options, defaultValue: ['react', 'svelte'], 'aria-label': 'Frameworks', size: 3 },
}