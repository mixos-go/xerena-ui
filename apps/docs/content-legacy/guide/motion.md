# Motion

Xerena's motion system is a contract, not a garnish: smooth, interruptible,
measured, and earned. This page is the discipline — the `motion` tokens in
`@xerena/tokens` are the values, and the rules below are how they are used.

## Principles

1. **Smooth** — motion runs at 60fps. Animate only `transform` and `opacity`;
   never animate layout-affecting properties (`width`, `height`, `top`, `left`,
   `margin`, `font-size`). Layout changes are instant; the transform/opacity on
   top of them animates.
2. **Composed tempo** — default duration is 150ms. Motion finishes quickly and
   the interface settles back to stillness. Reserve long durations for real
   visual distance or heavy roles.
3. **Interruptible** — use CSS transitions, never long or chained `animation`
   runs or fixed timers. When state changes mid-motion, start from where the
   element is — never reset and replay.
4. **Earned** — every motion has a job: orientation, cause-and-effect, or brand
   emphasis. Zero decorative motion.
5. **Motion is identity** — only brand moments (mark, lockup, hero, onboarding
   splash) may use `emphatic` duration and `emphasis` easing.

## Duration scale

| token | value | use |
|---|---|---|
| `instant` | 1ms | reduced-motion substitute; state that must be immediate |
| `fast` | 100ms | hover, focus, color, micro-interaction |
| `base` | 150ms | default UI motion |
| `moderate` | 250ms | light panels appearing/disappearing, list reorder |
| `long` | 400ms | dialog, sheet, overlay |
| `emphatic` | 600ms | brand moments only |

Selection rule: start at `base` and move one step per level of visual distance
or weight. `instant` is not a visible animation duration — it exists for the
reduced-motion path.

Web: `transition-duration: calc(var(--xr-motion-duration-base) * 1ms);`
Native: `Animated.timing(..., { duration: motion.duration.base, ... })`.

## Easing tiers

| token | curve | use |
|---|---|---|
| `standard` | `cubic-bezier(0.2, 0, 0, 1)` | default; calm deceleration, no overshoot |
| `enter` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | element arriving into place |
| `exit` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | element leaving quickly, no lingering |
| `emphasis` | `cubic-bezier(0.34, 1.3, 0.64, 1)` | the only overshoot curve (~2–4%); brand moments |

Rules:

- `standard` is the default for everything not listed below.
- `enter`/`exit` are a pair. Use the same tier for an element's arrival and
  departure; never mix `enter` in and `exit`-as-enter out.
- `emphasis` is reserved. Overshoot reads as character — spend it on brand
  moments, not on buttons.

Web: `transition-timing-function: cubic-bezier(var(--xr-motion-easing-enter));`
Native: `easing: Easing.bezier(...motion.easing.enter)`.

## Behavior patterns

| behavior | properties | duration | easing | note |
|---|---|---|---|---|
| Hover / focus | `transform`, `color`, `box-shadow` | `fast` | `standard` | lift via transform + elevation, not border |
| Appear (new content) | `opacity`, `transform` (translateY 8px → 0) | `base` | `enter` | fade + slight rise shows origin |
| Disappear | `opacity`, `transform` | `fast` | `exit` | leave quickly, no lingering |
| Panel / dialog / sheet | `opacity`, `transform` | `long` | `enter` | dim + rise; backdrop fades `base` |
| List reorder | `transform` | `moderate` | `standard` | elements glide to new slots |
| Loading | `opacity`, indeterminate progress | `fast` | `standard` | movement signals activity, then stills |
| Page / route | `opacity`, `transform` (directional) | `long` | `enter` | direction follows navigation |
| Brand moment | `transform`, `opacity` | `emphatic` | `emphasis` | mark, lockup, hero |

## Reduced motion

Respect `prefers-reduced-motion`. The `instant` token is the designated
substitute. App layer, web:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: calc(var(--xr-motion-duration-instant) * 1ms) !important;
    animation-duration: calc(var(--xr-motion-duration-instant) * 1ms) !important;
    animation-iteration-count: 1 !important;
  }
}
```

Guidance:

- Non-essential motion becomes `instant`; keep opacity-only changes.
- Essential feedback (loading, error, focus) stays but shortens.
- Never strip motion that carries orientation — appearing elements may still
  fade in, they just do not travel.
- Respect the OS setting; a provider-level toggle is a later-phase concern.

## Dos & don'ts

- Do animate only `transform` and `opacity`.
- Do prefer elevation (`--xr-elevation-*`) over borders to lift elements.
- Don't animate `border`, `top`/`left`, `width`/`height`, or `font-size`.
- Don't run repeating motion more than ~2 cycles.
- Don't chain `animation`s or fixed timers; transitions are interruptible.
- Do cancel drift: an interrupt wins over the current motion.

## Integration

Runtime hooks, motion primitives, and component-level motion arrive in the
Styling and Components phases. The `@xerena/tokens` `motion` namespace is the
binding contract for all of them — web, native, and documentation read the
same values.
