# Divider

Horizontal or vertical rule that separates content groups.

## Import

```tsx
import { Divider } from '@xerena/react'
```

## Usage

```tsx
<Divider />
<Divider label="or" />
<Divider orientation="vertical" />
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Line direction. |
| `variant` | `'solid' \| 'dashed'` | `'solid'` | Line style. |
| `label` | `string` | — | Optional centered label between two lines. |
| `className` | `string` | — | Extra class names. |

## Variants

- `solid` — a continuous `1px` rule.
- `dashed` — a repeating dashed rule.
- Labeled — with `label`, renders two rule segments flanking the label instead of a full-width rule.

## Motion

No runtime motion; dividers are static.

## Accessibility

- Always exposes `role="separator"` with `aria-orientation` matching the `orientation` prop.

## See also

- [Text](/guide/components/typography/text)
- [Stack](/guide/components/layout/stack)