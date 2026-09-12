# Xerena — Motion Design (Phase 3)

**Date:** 2026-09-12
**Status:** Approved in design discussion (sections 1–3), pending written-spec review
**Predecessor spec:** `docs/superpowers/specs/2026-09-12-xerena-brand-design.md` (Phase 2)
**Depends on:** `@xerena/tokens` (foundation + brand), `apps/docs`, `apps/storybook`

## Context

The brand phase locked principle 4: **Motion is identity** — smooth, controllable
motion is a product promise, and motion tokens arrive in the phase after brand.
This phase delivers exactly that: a `motion` token namespace (duration + easing)
and a written motion discipline (patterns, dos/don'ts, reduced-motion strategy).

Scope boundary, confirmed with the user: **foundation + documented patterns**.
No runtime animation code — no hooks, no utilities in `@xerena/react` or
`@xerena/brand`, no new deps. Pattern guidance ships as the documentation page,
with CSS/TS snippets shown as examples only.

## Motion Character

**Composed calm**: fast, measured. Motion finishes quickly and the interface
settles back to stillness. Selected by the user over editorial-slow and
utilitarian-fast.

- Base duration **150ms** for default UI motion.
- Longest recognized duration **600ms**, reserved for brand moments.
- One easing tier (`emphasis`) carries a subtle ~2–4% overshoot; every other
  curve dampens without overshoot.

## Principles (operationalized from brand principle 4)

1. **Smooth** — motion runs at 60fps; animate only `transform` and `opacity`.
   Never animate layout-affecting properties (`width`, `height`, `top`, `left`,
   `margin`, `font-size`).
2. **Composed tempo** — default 150ms; short durations do most of the work.
   Long durations only where the visual distance or role demands them.
3. **Interruptible** — use CSS transitions (not chained/long `animation` runs or
   fixed timers). A new state change starts from the current state, never by
   resetting and replaying.
4. **Earned** — every motion has a job: orientation, cause-and-effect, or brand
   emphasis. Zero decorative motion.
5. **Motion is identity** — only brand moments (mark, lockup, hero, onboarding
   splash) use `emphatic` + `emphasis`.

## Tokens

Namespace `motion` added to `packages/tokens/src/tokens.json`, flat keys as with
`color` / `spacing` / `typography` / `elevation` / `radius`.

### `motion.duration` (numbers, milliseconds, unitless in CSS — same convention as `radius`)

| key | value (ms) | use |
|---|---|---|
| `instant` | 1 | reduced-motion substitute, state that must be immediate |
| `fast` | 100 | hover, focus, color, micro-interaction |
| `base` | 150 | default UI motion |
| `moderate` | 250 | appearing/disappearing light panels, list reorder |
| `long` | 400 | dialog, sheet, overlay |
| `emphatic` | 600 | brand moments only |

Selection rule: duration follows proximity and role — start at `base` and move
one step per level of visual distance/weight. `instant` is not a visible
animation duration; it exists for the reduced-motion path.

### `motion.easing` (arrays of four numbers `[x1, y1, x2, y2]`, cubic-bezier control points)

| key | values | role |
|---|---|---|
| `standard` | `0.2, 0, 0, 1` | calm deceleration, no overshoot — default motion |
| `enter` | `0.05, 0.7, 0.1, 1` | element arriving into place (appear) |
| `exit` | `0.3, 0, 0.8, 0.15` | element leaving quickly, no lingering |
| `emphasis` | `0.34, 1.3, 0.64, 1` | the only overshoot curve (~2–4%) — brand moments |

Only `emphasis` may overshoot. `enter`/`exit` are a pair and must not be mixed
across a single element's appearance and disappearance.

## Representation & emission

- **tokens.json storage:** durations as plain numbers; easings as arrays of four
  numbers.
- **Generator rule (new, tested):** when the generator recurses a namespace and
  hits an array value, it flattens it comma-joined into the CSS variable string.
  Expected emissions in `dist/tokens.css`:
  - `--xr-motion-duration-base: 150;`
  - `--xr-motion-duration-instant: 1;`
  - `--xr-motion-easing-standard: 0.2, 0, 0, 1;`
  - `--xr-motion-easing-emphasis: 0.34, 1.3, 0.64, 1;`
- **Web consumption:** `transition-duration: calc(var(--xr-motion-duration-base) * 1ms);`
  and `transition-timing-function: cubic-bezier(var(--xr-motion-easing-standard));`.
- **Native consumption:** `Animated.timing(..., { duration: motion.duration.base,
  easing: Easing.bezier(...motion.easing.standard) })` — the array form feeds
  `Easing.bezier` directly without string parsing.
- **Typed export:** `src/motion.ts` following the `typography.ts` pattern
  (`import tokens.json`, `keyof typeof` derivation), exporting
  `MotionDuration`/`MotionEasing` records and the key union types; re-exported
  from `src/index.ts`.

## Reduced Motion

- Token `motion.duration.instant` (1ms) is the designated reduced-motion
  substitute.
- The documentation page specifies the app-layer pattern:
  `@media (prefers-reduced-motion: reduce)` — non-essential motion becomes
  `var(--xr-motion-duration-instant)` with opacity-only changes; essential
  feedback (loading, error) stays but shortens; never strip motion that carries
  orientation.
- Respect the operating-system preference; a provider-level toggle is a
  Styling/Components phase concern, not this one.

## Documentation — `apps/docs/guide/motion.md`

New VitePress guide page, added to the guide sidebar in
`apps/docs/.vitepress/config.mts`. Outline:

1. **Principles** — the five above, each with one concrete consequence.
2. **Duration scale** — table + selection rule.
3. **Easing tiers** — table + when to use each; enter/exit pairing rule;
   emphasis-for-brand-moments rule.
4. **Behavior patterns** — per behavior (hover/focus, appear/disappear,
   panel/dialog/sheet, list reorder, loading, page/route, brand moment):
   allowed properties, duration, easing tier, note.
5. **Reduced motion** — the media-query pattern above.
6. **Dos & don'ts** — property restrictions (transform/opacity), no repeating
   motion, no animating borders/top/left, interrupts must win, etc.
7. **Integration note** — runtime hooks/utilities and component-level motion
   belong to the Styling/Components phases; these tokens are the binding
   contract.

## Storybook — `apps/storybook/stories/tokens.stories.tsx`

Token gallery extended with a Motion section: duration swatches and easing
curve previews, consistent with the existing gallery pattern.

## Tests

`packages/tokens/src/index.test.ts` extended (test-first):
- `motion.duration` exact values; `motion.easing` exact tuples.
- Key unions match the token keys.
- Array emission rule: generator output for easing produces the comma-joined
  CSS var; `dist/tokens.css` contains `--xr-motion-duration-base: 150;` and
  `--xr-motion-easing-standard: 0.2, 0, 0, 1;`.

## Non-Goals (this phase)

- No runtime animation code (hooks, utilities, components) in any package.
- No motion on `@xerena/brand` components or `@xerena/react` surfaces.
- No new dependencies.
- No spring-physics system, no keyframe libraries, no GSAP integration.

## Roadmap Note

Phase 4 (Styling composition) and Phase 5+ (Components) consume
`@xerena/tokens` `motion` namespace as the shared contract; the reduced-motion
toggle and any motion primitives land there, not here.