# Switch

Persistent on/off control with a sliding thumb.

## Import

```tsx
import { Switch } from '@xerena/react'
```

## Usage

```tsx
<Switch checked={enabled} onCheckedChange={setEnabled} />
<Switch size="sm" />
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | — | Controlled state; omit for uncontrolled. |
| `onCheckedChange` | `(checked: boolean) => void` | — | Toggle callback. |
| `size` | `'sm' \| 'md'` | `'md'` | Footprint (36x20 / 44x24). |
| `disabled` | `boolean` | `false` | Disable interactions. |
| `className` | `string` | — | Extra class names. |

## Variants

- Controlled or uncontrolled.
- `sm` / `md`.
- Disabled.
- Focused.

## Motion

| Event | Property | Duration | Easing | Reduced fallback |
|---|---|---|---|---|
| Toggle | background-color | `base` | `standard` | none |
| Toggle | transform (thumb) | `base` | `standard` | none |

## Accessibility

- Rendered as a `<button role="switch">` with `aria-checked`.
- Focus is exposed with a 3px primary ring.

## See also

- [Checkbox](/guide/components/form/checkbox)
- [Radio](/guide/components/form/radio)