# Styling

The Styling foundation is the ergonomic layer between design tokens and
components — three layers shipped in `@xerena/styling`:

- A **token-driven utility stylesheet** (`@xerena/styling/styles.css`).
- **Typed style helpers** for raw cross-platform values and CSS-ready strings.
- **Motion hooks** (`@xerena/styling/react`) for reduced-motion-correct motion.

No runtime animation code lives here; phases after this one consume these
layers to build components.

## Utility classes

Import the stylesheet once, after `@xerena/tokens/tokens.css`:

```ts
import '@xerena/tokens/tokens.css'
import '@xerena/styling/styles.css'
```

Every class references the design-token CSS variables, so overrides and dark
mode keep working through the variable layer. Unitless numeric tokens are
consumed through `calc`.

| Family | Classes | Example |
|---|---|---|
| Color | `xr-bg-{name}-{shade}`, `xr-text-{name}-{shade}`, `xr-border-{name}-{shade}` | `xr-bg-ember-600` |
| Spacing | `xr-p-{k}`, `xr-px-{k}`, `xr-py-{k}`, `xr-m-{k}`, `xr-mx-{k}`, `xr-my-{k}`, `xr-gap-{k}` | `xr-p-4`, `xr-gap-6` |
| Typography | `xr-font-family-{family}`, `xr-font-size-{variant}-{size}`, `xr-leading-{variant}-{size}`, `xr-font-weight-{variant}-{size}`, `xr-tracking-{variant}-{size}` | `xr-font-family-body`, `xr-font-size-body-md` |
| Elevation | `xr-elevation-{key}` | `xr-elevation-raised` |
| Radius | `xr-radius-{key}` | `xr-radius-lg` |
| Motion | `xr-duration-{key}`, `xr-ease-{key}` | `xr-duration-base`, `xr-ease-standard` |

> Semantic colors become available as utilities in the Components phase,
> together with `--xr-semantic-*` variables and theming (`xr-bg-primary`).

## Style helpers

Helpers never duplicate token data — they read `@xerena/tokens` and add typed
access plus CSS-name resolution. The root export has no React dependency, so
React Native consumers can use it in Phase 6.

```ts
import { cssVar, css, spacingValue, radiusValue, durationValue, easingValue } from '@xerena/styling'
```

| Function | Returns | Example result |
|---|---|---|
| `cssVar(path)` | bare CSS variable reference | `"var(--xr-color-ember-600)"` |
| `css(path)` | CSS-ready value | `"calc(var(--xr-spacing-4) * 1px)"`, `"cubic-bezier(var(--xr-motion-easing-standard))"` |
| `spacingValue(key)` | raw number | `16` |
| `radiusValue(key)` | raw number | `12` |
| `durationValue(key)` | raw milliseconds | `150` |
| `easingValue(key)` | 4-point control tuple | `[0.2, 0, 0, 1]` |

## Motion hooks

```ts
import { useReducedMotion, useMotion } from '@xerena/styling/react'
```

- `useReducedMotion()` — `boolean`; follows `prefers-reduced-motion: reduce`,
  reactive to system changes, `false` during SSR.
- `useMotion({ reducedMotion? })` — `{ durations, easings, reduced }`.
  `durations` are CSS-ready milliseconds; when reduced (system or the
  `reducedMotion` override) **every duration snaps to `1ms`**. `easings` are
  `cubic-bezier(...)` strings and never change with reduced motion.

```tsx
function Example({ children }) {
  const { durations, easings } = useMotion()
  return (
    <div style={{ transitionDuration: durations.fast, transitionTimingFunction: easings.standard }}>
      {children}
    </div>
  )
}
```

Runtime motion primitives and component-level motion arrive in the Components
phase; the values above are the binding contract for them.
