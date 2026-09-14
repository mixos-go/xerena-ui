# Accordion

Expandable sections composed from Root + Item + Header + Trigger + Content.

## Import

```tsx
import { Accordion } from '@xerena/react'
```

## Usage

```tsx
<Accordion.Root type="single" defaultValue={['faq']}>
  <Accordion.Item value="faq">
    <Accordion.Header>
      <Accordion.Trigger value="faq">Frequently asked</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content value="faq">
      <Text>Answers live here.</Text>
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

## Composition

| Component | Props | Description |
|---|---|---|
| `Accordion.Root` | `type?: 'single' \| 'multiple'`, `defaultValue?: string[]`, `children` | Owns the expanded set. |
| `Accordion.Item` | `value: string`, `children` | Section shell (`data-state="open"`). |
| `Accordion.Header` | `children` | `h3` heading wrapper. |
| `Accordion.Trigger` | `value: string`, `children`, `className` | `aria-expanded` toggle with a rotating chevron. |
| `Accordion.Content` | `value: string`, `children` | `role="region"` panel, rendered only when open. |

## Root props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `'single' \| 'multiple'` | `'single'` | Single open section (or many). |
| `defaultValue` | `string[]` | `[]` | Initially expanded values. |

## Variants

- `single` — opening one collapses others.
- `multiple` — several sections open at once.

## Motion

| Event | Property | Duration | Easing | Reduced fallback |
|---|---|---|---|---|
| Open / close | chevron transform (rotate) | `fast` | `standard` | none |
| Open / close | max-height (content reveal) | `moderate` | `standard` | none |

`useReducedMotionSync` disables both transitions under reduced motion.

## Accessibility

- Trigger exposes `aria-expanded` and `aria-controls` pointing at the panel id.
- Content wraps in `role="region"`, so its contents stay reachable while open.

## See also

- [Tabs](/guide/components/navigation/tabs)
- [Menu](/guide/components/navigation/menu)