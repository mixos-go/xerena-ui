# Link

Inline text link for navigation.

## Import

```tsx
import { Link } from '@xerena/react'
```

## Usage

```tsx
<Link href="https://example.com">Read the docs</Link>
<Link variant="muted">Secondary link</Link>
<Link variant="animated">Animated link</Link>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'default' \| 'muted' \| 'animated'` | `'default'` | Visual treatment. |
| `href` | `string` | — | Destination URL. |
| `target` | `'_blank'` | — | Open in a new tab. |
| `rel` | `string` | — | Link relationship. |
| `asChild` | `boolean` | `false` | Merge styles onto a child element. |
| `className` | `string` | — | Extra class names. |
| `children` | `ReactNode` | required | Link label. |

## Variants

- `default` — primary color, no underline.
- `muted` — muted text color.
- `animated` — underlined with offset (CSS-only treatment).

## Motion

No runtime motion.

## Accessibility

- Renders a real `<a>` with native focus and keyboard activation.
- When `target="_blank"`, provide `rel` (for example `noopener`).
- Use descriptive link text; avoid bare "click here" labels.

## See also

- [Button](/guide/components/actions/button)
- [Breadcrumb](/guide/components/navigation/breadcrumb)