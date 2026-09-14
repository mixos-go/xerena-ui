import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Combobox } from '@xerena/react'

const Cities = ['Amsterdam', 'Berlin', 'Copenhagen', 'Lisbon', 'London', 'Oslo', 'Paris', 'Stockholm']

const meta: Meta<typeof Combobox.Root> = {
  title: 'Form/Combobox',
  component: Combobox.Root,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Combobox.Root>

export const Default: T = {
  render: () => {
    const [query, setQuery] = useState('')
    const filtered = Cities.filter((c) => c.toLowerCase().startsWith(query.toLowerCase()))
    return (
      <div style={{ width: 260 }}>
        <Combobox.Root>
          <Combobox.Input placeholder="Search city" value={query} onChange={setQuery} />
          <Combobox.List>
            {filtered.map((c) => (
              <Combobox.Option key={c} value={c}>{c}</Combobox.Option>
            ))}
          </Combobox.List>
        </Combobox.Root>
      </div>
    )
  },
}
export const OpenWithOptions: T = {
  render: () => (
    <div style={{ width: 260 }}>
      <Combobox.Root defaultOpen>
        <Combobox.Input placeholder="Search city" />
        <Combobox.List open>
          {Cities.map((c) => (
            <Combobox.Option key={c} value={c}>{c}</Combobox.Option>
          ))}
        </Combobox.List>
      </Combobox.Root>
    </div>
  ),
}
export const WithClear: T = {
  render: () => {
    const [query, setQuery] = useState('')
    const [selected, setSelected] = useState<string[]>([])
    return (
      <div style={{ width: 260 }}>
        <Combobox.Root>
          <Combobox.Input placeholder="Search city" value={query} onChange={(v) => { setQuery(v); setSelected([]) }} />
          <Combobox.List>
            {Cities.map((c) => (
              <Combobox.Option key={c} value={c}>{c}</Combobox.Option>
            ))}
          </Combobox.List>
          {selected.length > 0 && <Combobox.Clear onClear={() => setSelected([])} />}
        </Combobox.Root>
      </div>
    )
  },
}