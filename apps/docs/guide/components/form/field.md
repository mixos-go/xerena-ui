# Field

Label, control, hint, and error wrapper for form inputs.

::: tip React Native
Natively `asChild` has no equivalent; error/disabled flow via context. See [React Native](/guide/native).
:::

## Import

```tsx
import { Field } from '@xerena/react'
```

## Usage

```tsx
<Field label="Email" hint="We never share your email.">
  <Input type="email" placeholder="you@example.com" />
</Field>
<Field label="Name" error="Name is required" required>
  <Input />
</Field>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Field label; also derives the `htmlFor` id when `htmlFor` is omitted. |
| `hint` | `string` | — | Helper text shown when there is no error. |
| `error` | `string` | — | Error text; shown with `role="alert"`, hides the hint. |
| `required` | `boolean` | `false` | Adds a required asterisk to the label. |
| `htmlFor` | `string` | — | Explicit control id; defaults to a slugified label. |
| `asChild` | `boolean` | `false` | Declared for composite control slots; not applied by the current implementation. |
| `disabled` | `boolean` | `false` | Declared for group state; not applied by the current implementation. |
| `className` | `string` | — | Extra class names. |
| `children` | `ReactNode` | required | The form control. |

## Variants

- With hint — helper text under the control.
- With error — error text replaces the hint and adds the `xr-field--error` modifier.

## Motion

No runtime motion.

## Accessibility

- Uses a real `<label htmlFor>` association with the control id (sluggified from `label` unless overridden).
- Error text renders with `role="alert"` and is announced when shown.

## See also

- [Input](/guide/components/form/input)
- [Textarea](/guide/components/form/textarea)
- [Select](/guide/components/form/select)