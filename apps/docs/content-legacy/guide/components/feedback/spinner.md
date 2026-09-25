# Spinner

Circular loading indicator with an accessible label.

## Import

```tsx
import { Spinner } from '@xerena/react'
```

## Usage

```tsx
<Spinner size="md" label="Loading reports" />
<Button loading><Spinner size="sm" />Saving</Button>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Footprint (16 / 24 / 40). |
| `label` | `string` | `'Loading…'` | Screen-reader status text. |
| `className` | `string` | — | Extra class names. |

## Variants

- `sm` — inline / button context.
- `md` — default.
- `lg` — large surface.

## Motion

| Event | Property | Duration | Easing | Reduced fallback |
|---|---|---|---|---|
| Loading | rotation (`xr-spin`, 0.8s linear infinite) | 0.8s cycle | `linear` | none (spinner is static) |

Reduced motion disables the rotation while keeping the `role="status"` announcement.

## Accessibility

- Host exposes `role="status"` with the `label` as visible sr-only text; the visual ring is `aria-hidden`.

## See also

- [Skeleton](/guide/components/typography/skeleton)
- [Progress](/guide/components/feedback/progress)