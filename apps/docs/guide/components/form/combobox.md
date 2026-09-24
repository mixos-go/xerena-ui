# Combobox

Filterable listbox with a text input, built from Root + subcomponents.

::: tip React Native
Natively a `TextInput` + modal filter list via `ListOverlay`. See [React Native](/guide/native).
:::

## Import

```tsx
import { Combobox } from '@xerena/react'
```

## Usage

```tsx
const Cities = ['Amsterdam', 'Berlin', 'Copenhagen']
const [query, setQuery] = useState('')
const filtered = Cities.filter((c) => c.toLowerCase().startsWith(query.toLowerCase()))

<Combobox.Root>
  <Combobox.Input placeholder="Search city" value={query} onChange={setQuery} />
  <Combobox.List>
    {filtered.map((c) => (
      <Combobox.Option key={c} value={c}>{c}</Combobox.Option>
    ))}
  </Combobox.List>
</Combobox.Root>
```

## Composition

| Component | Props | Description |
|---|---|---|
| `Combobox.Root` | `defaultOpen?: boolean` | Contains open/active/selected state. |
| `Combobox.Input` | input props + `placeholder`, `value`, `onChange`, `className` | `role="combobox"`, `aria-autocomplete="list"`; opens the list on change and focus. |
| `Combobox.List` | `open?: boolean`, `className` | `role="listbox"`; rendered only when open (opens by default from context). |
| `Combobox.Option` | `value: string`, `children`, `className` | `role="option"`; highlights and selects on mouse down. |
| `Combobox.Clear` | `onClear?: () => void` | Clears the selected set. |

## Variants

- Default — filter-then-select flow.
- `Root defaultOpen` / `List open` — render the list open without interaction.
- With `Combobox.Clear` — visible clear affordance after a selection.

## Motion

No runtime motion in the combobox itself.

## Accessibility

- The input exposes the combobox pattern (`role="combobox"`, `aria-expanded`, `aria-autocomplete="list"`); selecting sets `aria-selected` on the matching option.

## See also

- [Select](/guide/components/form/select)
- [Input](/guide/components/form/input)