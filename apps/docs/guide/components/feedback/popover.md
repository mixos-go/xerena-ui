# Popover

Floating panel anchored to a trigger, composed from Root + Trigger + Content.

::: tip React Native
Natively an anchored `Overlay` positioned from trigger geometry. See [React Native](/guide/native).
:::

## Import

```tsx
import { Popover } from '@xerena/react'
```

## Usage

```tsx
<Popover.Root>
  <Popover.Trigger>
    <Button variant="outline">More options</Button>
  </Popover.Trigger>
  <Popover.Content side="bottom">
    <Button variant="ghost" size="sm" fullWidth>Copy</Button>
    <Button variant="ghost" size="sm" fullWidth>Duplicate</Button>
  </Popover.Content>
</Popover.Root>
```

## Composition

| Component | Props | Description |
|---|---|---|
| `Popover.Root` | `open?`, `defaultOpen?`, `onClose?`, `children` | Owns open/anchor state; defaults to uncontrolled. |
| `Popover.Trigger` | `children` | Slot-wrapped trigger: sets the anchor, toggles on click, closes on Escape, opens on ArrowDown. |
| `Popover.Content` | `children`, `side?`, `className` | `role="dialog"` positioned relative to the anchor; portal-backed. |

## Content props

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Edge the popover opens from. |

## Variants

- Four open edges; anchored coordinates are computed from the trigger rect at open time.

## Motion

| Event | Property | Duration | Easing | Reduced fallback |
|---|---|---|---|---|
| Mount | none (positions statically) | — | — | — |

The popover content mounts directly with no CSS transition.

## Accessibility

- Trigger exposes `aria-haspopup="dialog"` and `aria-expanded`.
- Content is `role="dialog"`; Escape and outside click close via `OverlayPrimitive`.

## See also

- [Tooltip](/guide/components/feedback/tooltip)
- [Dialog](/guide/components/feedback/dialog)
- [Menu](/guide/components/navigation/menu)