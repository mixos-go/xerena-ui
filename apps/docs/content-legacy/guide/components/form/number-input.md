# NumberInput

Numeric input with steppers, clamping, and a compact variant.

## Import

```tsx
import { NumberInput } from '@xerena/react'
```

## Usage

```tsx
<NumberInput value={count} onValueChange={setCount} min={0} max={10} />
<NumberInput variant="compact" step={2} min={0} max={100} />
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — | Controlled value. |
| `onValueChange` | `(n: number) => void` | — | Value callback (already clamped). |
| `min` | `number` | `-Infinity` | Minimum clamp. |
| `max` | `number` | `Infinity` | Maximum clamp. |
| `step` | `number` | `1` | Increment / decrement. |
| `variant` | `'default' \| 'compact'` | `'default'` | Stepper layout. |
| `disabled` | `boolean` | `false` | Disable the input and steppers. |
| `className` | `string` | — | Extra class names. |

## Variants

- `default` — vertical up/down steppers on the right edge.
- `compact` — minus and plus buttons flanking the input.

## Motion

| Event | Property | Duration | Easing | Reduced fallback |
|---|---|---|---|---|
| Hover on stepper | background-color | `instant` | — | none |

## Accessibility

- The input renders `role="spinbutton"` with `aria-valuemin/max/now`.
- Steppers carry `aria-label="Increase"` / `aria-label="Decrease"` and clamp at the bounds (disabled at limits).

## See also

- [Slider](/guide/components/form/slider)
- [Input](/guide/components/form/input)