# Text

Renders body-scale text using the shared type tokens.

## Import

```tsx
import { Text } from '@xerena/react'
```

## Usage

```tsx
<Text size="md" variant="body">Plain body copy.</Text>
<Text variant="muted">Secondary helper text.</Text>
<Text variant="strong">Bold emphasis.</Text>
<Text font="mono">const x = 1</Text>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'body' \| 'muted' \| 'strong' \| 'error'` | `'body'` | Semantic style: shared color and weight. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Type scale size. |
| `font` | `'body' \| 'mono'` | `'body'` | Type family to use. |
| `truncate` | `boolean` | `false` | Truncate overflowing text with an ellipsis. |
| `center` | `boolean` | `false` | Center-align the content. |
| `asChild` | `boolean` | `false` | Merge the styles onto a single child element. |
| `style` | `CSSProperties` | — | Inline styles. |
| `className` | `string` | — | Extra class names. |
| `children` | `ReactNode` | required | The text content. |

## Variants

- `body` — default text color.
- `muted` — secondary color (`textMuted`).
- `strong` — default color with weight 600.
- `error` — danger text color (`dangerText`).

## Motion

No runtime motion; text is static.

## Accessibility

- Renders a `<span>` by default; pass `asChild` to keep a semantic element such as `<p>` styled as text.
- `truncate` sets `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` and is decorative only.

## See also

- [Heading](/guide/components/typography/heading)
- [Badge](/guide/components/typography/badge)
- [Skeleton](/guide/components/typography/skeleton)
- [Kbd](/guide/components/typography/kbd)