# Badge

Pill-shaped status label built from semantic color pairs.

## Import

```tsx
import { Badge } from '@xerena/react'
```

## Usage

```tsx
<Badge tone="success">Active</Badge>
<Badge tone="warning" size="sm">Pending</Badge>
<Badge tone="brand">New</Badge>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `'neutral' \| 'brand' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Semantic color pair (background + text). |
| `size` | `'sm' \| 'md'` | `'md'` | Text scale and padding. |
| `className` | `string` | — | Extra class names. |
| `children` | `ReactNode` | required | Badge content. |

## Variants

Tones map to semantic tokens: `neutral` (surface/textMuted), `brand` (primary/textOnStrong), and `info`, `success`, `warning`, `danger` each use their matching `*Surface` background and `*Text` foreground.

## Motion

No runtime motion; badges are static.

## Accessibility

- Renders an inline `<span>`; if the badge carries meaning beyond the surrounding text, add an explicit label (for example via a sr-only companion or `aria-label` on a wrapping element).

## See also

- [Text](/guide/components/typography/text)
- [Divider](/guide/components/typography/divider)