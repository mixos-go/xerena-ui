# Progress

Multi-modal progress indicator: bar, page rails, cursor ring, or circle.

::: tip React Native
The `mouse` variant is web-only; native variants are `bar`, `pageTop`, `pageBottom`, `circle`. See [React Native](/guide/native).
:::

## Import

```tsx
import { Progress } from '@xerena/react'
```

## Usage

```tsx
<Progress value={62} variant="bar" />
<Progress value={40} variant="circle" size={96} stroke={10} />
<Progress variant="pageTop" value={allDone ? 100 : 30} />
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | `0` | Progress 0–100 (clamped). |
| `variant` | `'bar' \| 'pageTop' \| 'pageBottom' \| 'mouse' \| 'circle'` | `'bar'` | Presentation mode. |
| `size` | `number` | `80` | Circle diameter in px. |
| `stroke` | `number` | `8` | Circle stroke width in px. |
| `className` | `string` | — | Extra class names. |
| `label` | `string` | — | Progressbar accessible label. |

## Variants

- `bar` — inline track with a filled width.
- `pageTop` / `pageBottom` — 3px fixed rails at the top or bottom of the viewport.
- `mouse` — fixed ring that follows the pointer.
- `circle` — SVG ring with a stroke-dashoffset value.

## Motion

| Event | Property | Duration | Easing | Reduced fallback |
|---|---|---|---|---|
| Value change (bar) | width (fill) | `base` | `standard` | none |
| Value change (circle) | stroke-dashoffset | `base` | `standard` | none |
| Cursor tracking (mouse) | border-color (ring) | `base` | `standard` | none |

`useReducedMotionSync` gates the transitions; under reduced motion the indicator jumps instantly and the mouse ring stops tracking.

## Accessibility

- All modes expose `role="progressbar"` with `aria-valuenow/min/max`; pass `label` for an accessible name.

## See also

- [Spinner](/guide/components/feedback/spinner)
- [Slider](/guide/components/form/slider)