# Input

Single-line text input with error and fill variants.

## Import

```tsx
import { Input } from '@xerena/react'
```

## Usage

```tsx
<Field label="Name">
  <Input placeholder="Ada Lovelace" />
</Field>
<Input variant="filled" error aria-invalid />
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | Surface treatment. |
| `error` | `boolean` | `false` | Error state: sets `aria-invalid` and danger border. |
| `disabled` | `boolean` | — | Native `disabled`. |
| `readOnly` | `boolean` | — | Native `readOnly`. |
| `className` | `string` | — | Extra class names. |
| `style` | `CSSProperties` | — | Inline styles. |

Extends the native `InputHTMLAttributes` (minus `size`), so placeholder, `type`, `onChange`, and all other standard input props are supported.

## Variants

- `outlined` — transparent background with a border.
- `filled` — `surface` background with a border.

Combined with `error`, the border switches to the danger color.

## Motion

| Event | Property | Duration | Easing | Reduced fallback |
|---|---|---|---|---|
| Focus | border-color | `fast` | `standard` | none |

## Accessibility

- Native `<input>` semantics; `error` sets `aria-invalid`.
- Focus-visible shows a 3px primary focus ring.

## See also

- [Field](/guide/components/form/field)
- [Textarea](/guide/components/form/textarea)
- [InputGroup](/guide/components/form/input-group)
- [NumberInput](/guide/components/form/number-input)