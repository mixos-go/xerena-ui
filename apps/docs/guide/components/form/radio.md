# Radio

Single option inside a radio group.

## Import

```tsx
import { Radio } from '@xerena/react'
```

## Usage

```tsx
<RadioGroup value={tone} onValueChange={setTone}>
  <Radio value="warm">Warm</Radio>
  <Radio value="cool">Cool</Radio>
</RadioGroup>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Identifier used by the parent group. |
| `checked` | `boolean` | — | Selected state (group drives it). |
| `onChange` | `() => void` | — | Local change callback. |
| `disabled` | `boolean` | `false` | Disable the option. |
| `name` | `string` | — | Group name. |
| `className` | `string` | — | Extra class names. |
| `children` | `ReactNode` | — | Optional label content. |

Radio reads the parent [RadioGroup](/guide/components/form/radio-group) context; clicking notifies the group with its `value`.

## Variants

- Selected (dot shown, primary border).
- Disabled.
- Focused (focus-ring class when focus is within).

## Motion

| Event | Property | Duration | Easing | Reduced fallback |
|---|---|---|---|---|
| Select | dot pop (`xr-radio-pop`) | `fast` | `emphasis` | none |

## Accessibility

- Rendered as a `<button role="radio">` with `aria-checked`; the group container exposes `role="radiogroup"`.

## See also

- [RadioGroup](/guide/components/form/radio-group)
- [Checkbox](/guide/components/form/checkbox)