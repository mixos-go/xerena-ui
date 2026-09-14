# Skeleton

Pulsing placeholder that shapes content while it loads.

## Import

```tsx
import { Skeleton } from '@xerena/react'
```

## Usage

```tsx
<Skeleton shape="line" width={240} height={16} />
<Skeleton shape="circle" width={40} height={40} />
<Skeleton shape="text" />
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `shape` | `'line' \| 'circle' \| 'rect' \| 'text'` | `'line'` | Placeholder geometry. |
| `width` | `number \| string` | — | Element width. |
| `height` | `number \| string` | — | Element height; `text` uses body line height by default. |
| `style` | `CSSProperties` | — | Inline styles. |
| `className` | `string` | — | Extra class names. |

## Variants

- `line` — default small bar.
- `circle` — full-radius disc (for avatars).
- `rect` — rectangular block.
- `text` — a line matching the body `md` line height.

## Motion

| Event | Property | Duration | Easing | Reduced fallback |
|---|---|---|---|---|
| Loading placeholder | opacity pulse (`xr-skeleton-pulse`, infinite) | `1.6s` | `ease-in-out` | none |

Reduced motion strips the pulse to a static placeholder.

## Accessibility

- The host element carries `role="status"` so screen readers announce loading state; the visual shape is `aria-hidden`.
- Prefer [Spinner](/guide/components/feedback/spinner) or [Progress](/guide/components/feedback/progress) with a label for longer waits.

## See also

- [Spinner](/guide/components/feedback/spinner)
- [Progress](/guide/components/feedback/progress)
- [Text](/guide/components/typography/text)