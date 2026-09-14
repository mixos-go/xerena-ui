# Slider

Range input with a filled track and value readouts.

## Import

```tsx
import { Slider } from '@xerena/react'
```

## Usage

```tsx
<Slider defaultValue={40} min={0} max={100} onValueChange={setVolume} />
<Slider orientation="vertical" min={5} max={10} step={1} />
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — | Controlled value. |
| `defaultValue` | `number` | `0` | Uncontrolled starting value. |
| `min` | `number` | `0` | Minimum. |
| `max` | `number` | `100` | Maximum. |
| `step` | `number` | `1` | Increment. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Track direction. |
| `onValueChange` | `(v: number) => void` | — | Value callback. |
| `disabled` | `boolean` | `false` | Disable drag and keyboard input. |
| `className` | `string` | — | Extra class names. |

## Variants

- Horizontal or vertical track.
- Controlled (`value`) or uncontrolled (`defaultValue`).
- Disabled.

## Motion

No runtime motion; the filled track updates instantly.

## Accessibility

- Renders a transparent native `<input type="range">` with `role="slider"`, `aria-valuemin/max/now`, and a visible focusable control beneath the styled track.

## See also

- [NumberInput](/guide/components/form/number-input)
- [Progress](/guide/components/feedback/progress)