# Card

Surface container with elevation, border, padding, and an interactive option.

::: tip React Native
Natively `asChild` has no equivalent; elevation uses the `nativeElevation` parser. See [React Native](/guide/native).
:::

## Import

```tsx
import { Card } from '@xerena/react'
```

## Usage

```tsx
<Card variant="elevated" padding="lg">
  <Text variant="strong">Dashboard</Text>
</Card>
<Card variant="interactive" onClick={open}>
  <Text>Open report</Text>
</Card>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'outlined' \| 'elevated' \| 'soft' \| 'interactive' \| 'flat'` | `'outlined'` | Surface treatment. |
| `padding` | `keyof typeof spacing` (spacing tokens) | `'md'` | Inner padding in px. |
| `className` | `string` | — | Extra class names. |
| `children` | `ReactNode` | required | Card content. |

## Variants

- `outlined` — background with a border.
- `elevated` — background with `--xr-elevation-md`.
- `soft` — `surface` background, no border.
- `interactive` — bordered, focusable, pressable card (`role="button"`, `tabIndex=0`).
- `flat` — transparent, no border or shadow.

## Motion

| Event | Property | Duration | Easing | Reduced fallback |
|---|---|---|---|---|
| Interactive press | transform (translateY) | `base` | `standard` | none |
| Interactive hover/press | box-shadow (elevation switch) | `base` | `standard` | none |

## Accessibility

- Non-interactive cards are plain `div`s.
- `interactive` sets `role="button"` and `tabIndex=0` with a visible focus ring and press feedback; pair it with an `onClick` handler and keyboard activation.

## See also

- [Avatar](/guide/components/surfaces/avatar)
- [Button](/guide/components/actions/button)