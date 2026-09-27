'use client'

import { useState } from 'react'
import { Combobox } from '@xerena/react'
import { Preview } from '@xerena/preview'

const cities = ['Amsterdam', 'Berlin', 'Copenhagen']

const code = `const filtered = cities.filter((city) => city.toLowerCase().startsWith(query.toLowerCase()))

<Combobox.Root>
  <Combobox.Input placeholder="Search city" defaultValue="" onInput={(event) => setQuery(event.currentTarget.value)} />
  <Combobox.List>
    {filtered.map((city) => (
      <Combobox.Option key={city} value={city}>{city}</Combobox.Option>
    ))}
  </Combobox.List>
</Combobox.Root>`

export function ComboboxDemo() {
  const [query, setQuery] = useState('')
  const filtered = cities.filter((city) => city.toLowerCase().startsWith(query.toLowerCase()))
  return (
    <Preview title="Search city" code={code}>
      <Combobox.Root>
        <Combobox.Input placeholder="Search city" defaultValue="" onInput={(event) => setQuery(event.currentTarget.value)} />
        <Combobox.List>
          {filtered.map((city) => (
            <Combobox.Option key={city} value={city}>{city}</Combobox.Option>
          ))}
        </Combobox.List>
      </Combobox.Root>
      <p>Matches: {filtered.length}</p>
    </Preview>
  )
}
