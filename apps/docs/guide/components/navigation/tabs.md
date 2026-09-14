# Tabs

Tab navigation composed from Root + List + Trigger + Panel.

## Import

```tsx
import { Tabs } from '@xerena/react'
```

## Usage

```tsx
<Tabs.Root defaultValue="overview" variant="underline">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="overview"><Text>Overview content.</Text></Tabs.Panel>
  <Tabs.Panel value="activity"><Text>Activity content.</Text></Tabs.Panel>
</Tabs.Root>
```

## Composition

| Component | Props | Description |
|---|---|---|
| `Tabs.Root` | `defaultValue?`, `value?`, `onValueChange?`, `variant?`, `children` | Owns the active value; controlled or uncontrolled. |
| `Tabs.List` | `children`, `className` | `role="tablist"`; border or gap per variant. |
| `Tabs.Trigger` | `value: string`, `children`, `disabled?`, `className` | `role="tab"`; measured indicator for the active tab. |
| `Tabs.Panel` | `value: string`, `children`, `className` | `role="tabpanel"`; rendered only when active. |

## Root props

| Prop | Type | Default | Description |
|---|---|---|---|
| `defaultValue` | `string` | `''` | Uncontrolled initial tab. |
| `value` | `string` | — | Controlled active tab. |
| `onValueChange` | `(v: string) => void` | — | Tab switch callback. |
| `variant` | `'underline' \| 'pill' \| 'enclosed'` | `'underline'` | Trigger treatment. |

## Variants

- `underline` — border-bottom list with a sliding indicator.
- `pill` — full-radius triggers with small gaps.
- `enclosed` — bordered, overlapping triggers.
- Disabled triggers and controlled usage are supported.

## Motion

| Event | Property | Duration | Easing | Reduced fallback |
|---|---|---|---|---|
| Tab switch | indicator left / width | `moderate` | `standard` | none |
| Hover | color (trigger) | `fast` | `standard` | none |

`useReducedMotionSync` disables the indicator transition under reduced motion.

## Accessibility

- `role="tablist"` / `role="tab"` wiring with `aria-selected`, `aria-controls` pointing to the matching panel id.
- Panels expose `role="tabpanel"` with an `aria-labelledby` back-reference.

## See also

- [Accordion](/guide/components/navigation/accordion)
- [Menu](/guide/components/navigation/menu)
- [Breadcrumb](/guide/components/navigation/breadcrumb)