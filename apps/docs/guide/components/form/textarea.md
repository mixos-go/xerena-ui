# Textarea

Multi-line text input with resize control and error state.

## Import

```tsx
import { Textarea } from '@xerena/react'
```

## Usage

```tsx
<Field label="Bio">
  <Textarea placeholder="Tell us a little about yourself." />
</Field>
<Textarea resize="auto" />
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `resize` | `'none' \| 'auto'` | `'none'` | CSS resize behavior. |
| `error` | `boolean` | `false` | Error state: sets `aria-invalid` and danger border. |
| `disabled` | `boolean` | — | Native `disabled`. |
| `className` | `string` | — | Extra class names. |
| `style` | `CSSProperties` | — | Inline styles (merged last). |

Extends the native `TextareaHTMLAttributes`.

## Variants

- `resize="none"` — fixed size.
- `resize="auto"` — browser handles resizing.
- With `error` — danger border and `aria-invalid`.

## Motion

No runtime motion; focus is immediate.

## Accessibility

- Native `<textarea>` semantics with `aria-invalid` on error.

## See also

- [Field](/guide/components/form/field)
- [Input](/guide/components/form/input)