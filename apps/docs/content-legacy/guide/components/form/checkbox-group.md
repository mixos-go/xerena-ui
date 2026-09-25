# CheckboxGroup

Shares a value array and toggle function across [Checkbox](/guide/components/form/checkbox) siblings.

## Import

```tsx
import { CheckboxGroup } from '@xerena/react'
```

## Usage

```tsx
<CheckboxGroup value={plans} onValueChange={setPlans}>
  <Checkbox checked={plans.includes('day')} onCheckedChange={(c) => toggle('day', c)}>Day</Checkbox>
  <Checkbox checked={plans.includes('week')} onCheckedChange={(c) => toggle('week', c)}>Week</Checkbox>
</CheckboxGroup>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string[]` | — | Controlled selection array. |
| `onValueChange` | `(v: string[]) => void` | — | Selection callback. |
| `disabled` | `boolean` | `false` | Declared for group state; not wired through in the current implementation. |
| `className` | `string` | — | Extra class names. |
| `children` | `ReactNode` | required | Checkbox children. |

## Variants

- Controlled (`value`) or uncontrolled (internal array).

## Motion

No runtime motion in the group; individual checkboxes animate on toggle.

## Accessibility

- Exposes `role="group"`; associate a visible label for the set.
- Individual options are the accessible checkbox `role="checkbox"` elements.

## See also

- [Checkbox](/guide/components/form/checkbox)
- [RadioGroup](/guide/components/form/radio-group)