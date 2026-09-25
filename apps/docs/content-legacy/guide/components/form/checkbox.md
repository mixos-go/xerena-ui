# Checkbox

Single boolean toggle; can be controlled or uncontrolled.

## Import

```tsx
import { Checkbox } from '@xerena/react'
```

## Usage

```tsx
<Checkbox checked onCheckedChange={setAgreed} />
<Field label="Accept terms">
  <Checkbox />
</Field>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | — | Controlled state; omit for uncontrolled. |
| `onCheckedChange` | `(checked: boolean) => void` | — | Toggle callback. |
| `disabled` | `boolean` | `false` | Disable interactions. |
| `className` | `string` | — | Extra class names. |
| `children` | `ReactNode` | — | Optional content rendered next to the box. |

## Variants

- Controlled (`checked`) or uncontrolled (internal state).
- Disabled.
- Focused (focus-ring class applied when focus is within).

## Motion

| Event | Property | Duration | Easing | Reduced fallback |
|---|---|---|---|---|
| Toggle | background-color | `instant` | — | none |
| Toggle | transform (box) | `fast` | `emphasis` | none |

## Accessibility

- Rendered as a `<button role="checkbox">` with `aria-checked` mirroring state.
- Focus is exposed with a 3px primary ring.

## See also

- [CheckboxGroup](/guide/components/form/checkbox-group)
- [Switch](/guide/components/form/switch)
- [Radio](/guide/components/form/radio)
- [Table](/guide/components/data/table)