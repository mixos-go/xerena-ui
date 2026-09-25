# RadioGroup

Provides the shared value/change context for [Radio](/guide/components/form/radio) options.

## Import

```tsx
import { RadioGroup } from '@xerena/react'
```

## Usage

```tsx
<RadioGroup value={plan} onValueChange={setPlan} orientation="horizontal">
  <Radio value="free">Free</Radio>
  <Radio value="pro">Pro</Radio>
  <Radio value="team">Team</Radio>
</RadioGroup>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | `''` | Selected value. |
| `onValueChange` | `(v: string) => void` | — | Selection callback. |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Flex direction. |
| `disabled` | `boolean` | `false` | Declared for group state; not wired through in the current implementation. |
| `className` | `string` | — | Extra class names. |
| `children` | `ReactNode` | required | [Radio](/guide/components/form/radio) options. |

## Variants

- Vertical or horizontal layout.

## Motion

No runtime motion in the group; individual radios animate their dot on select.

## Accessibility

- Exposes `role="radiogroup"` with `aria-orientation`.
- Radio options must be keyboard-navigable via arrow keys in a full implementation.

## See also

- [Radio](/guide/components/form/radio)
- [CheckboxGroup](/guide/components/form/checkbox-group)