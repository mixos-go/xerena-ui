# Select

Native dropdown selector with the shared field styling.

## Import

```tsx
import { Select } from '@xerena/react'
```

## Usage

```tsx
<Field label="Region">
  <Select>
    <option value="eu">Europe</option>
    <option value="na">North America</option>
  </Select>
</Field>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `error` | `boolean` | `false` | Error state: sets `aria-invalid` and danger border. |
| `disabled` | `boolean` | — | Native `disabled`. |
| `className` | `string` | — | Extra class names. |
| `style` | `CSSProperties` | — | Inline styles. |

Extends the native `SelectHTMLAttributes`.

## Variants

- Default — outlined field styling with a custom chevron indicator.
- With `error` — danger border and `aria-invalid`.

## Motion

No runtime motion.

## Accessibility

- Native `<select>` semantics with `aria-invalid` on error; options remain fully operable by keyboard.

## See also

- [Field](/guide/components/form/field)
- [Combobox](/guide/components/form/combobox)