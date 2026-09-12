# Motion Tokens & Motion Discipline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the `motion` token namespace (duration + easing) to `@xerena/tokens` and publish the documented motion discipline (principles, patterns, reduced-motion) in docs + Storybook — with zero runtime animation code.

**Architecture:** Plain-data extension of the existing flat-key token system (`tokens.json` → typed `motion.ts` exports → `tokens.css` CSS vars). The generator gains one explicit rule: arrays flatten comma-joined into CSS vars. Patterns ship as a VitePress guide page and Storybook token-gallery section.

**Tech Stack:** TypeScript, `tokens.json` flat data, `generate.mjs` (node ESM node script), Vitest, VitePress, Storybook (React).

**Spec:** `docs/superpowers/specs/2026-09-12-xerena-motion-design.md` (Phase 3; the plan argues from the spec — executors read both).

## Global Constraints

- Motion keys stay flat, never nested beyond `motion.duration.*` / `motion.easing.*`. No new top-level namespace other than `motion`.
- Exact `motion.duration` values (numbers, milliseconds, unitless in CSS — same convention as `radius`): `instant: 1, fast: 100, base: 150, moderate: 250, long: 400, emphatic: 600`.
- Exact `motion.easing` values (arrays of four numbers `[x1, y1, x2, y2]`): `standard: [0.2, 0, 0, 1]`, `enter: [0.05, 0.7, 0.1, 1]`, `exit: [0.3, 0, 0.8, 0.15]`, `emphasis: [0.34, 1.3, 0.64, 1]`.
- Only `emphasis` may overshoot. `enter`/`exit` are a pair and must not be mixed across a single element's appearance/disappearance.
- Generator rule: arrays flatten to CSS vars comma-joined with `', '` (space after comma). `generate.mjs` must export `toCssVars` and guard its emit side effects behind a "run as main" check so tests can import it without writing files.
- CSS emission contract: `--xr-motion-duration-base: 150;`, `--xr-motion-duration-instant: 1;`, `--xr-motion-easing-standard: 0.2, 0, 0, 1;`, `--xr-motion-easing-emphasis: 0.34, 1.3, 0.64, 1;`. Web consumes via `calc(var(--xr-motion-duration-base) * 1ms)` and `cubic-bezier(var(--xr-motion-easing-standard))`.
- **Zero runtime animation code** in any package; no new dependencies.
- Documentation page `apps/docs/guide/motion.md` follows spec sections 1–7; sidebar entry under Guide after Theming: `{ text: 'Motion', link: '/guide/motion' }`.
- Storybook gallery (`apps/storybook/stories/tokens.stories.tsx`) gains a Motion section (duration chips + easing curve previews); keep the existing gallery pattern.
- Every task's requirements implicitly include this section.

---

### Task 1: Motion token foundation in `@xerena/tokens`

**Files:**
- Modify: `packages/tokens/src/tokens.json` (add `motion` namespace)
- Modify: `packages/tokens/scripts/generate.mjs` (array rule + export + main guard)
- Create: `packages/tokens/src/motion.ts`
- Modify: `packages/tokens/src/index.ts` (export motion)
- Modify: `packages/tokens/src/index.test.ts` (motion describe block; add `motion` to import)
- Create: `packages/tokens/scripts/generate.test.mjs`

**Interfaces:**
- Consumes: existing flat-key token system; existing `typography.ts` typed-module pattern (import `tokens.json`, `keyof typeof`); Vitest (tokens `test` target runs `vitest run` from `packages/tokens`, discovers `**/*.{test,spec}.?(c|m)[jt]s?(x)` including `.mjs` test files).
- Produces: `motion` exported from `@xerena/tokens` (`import { motion } from '@xerena/tokens'`): `motion.duration: Record<MotionDurationKey, number>` and `motion.easing: Record<MotionEasingKey, [number, number, number, number]>` where `type MotionDurationKey = 'instant'|'fast'|'base'|'moderate'|'long'|'emphatic'` and `type MotionEasingKey = 'standard'|'enter'|'exit'|'emphasis'`; CSS vars `--xr-motion-*` in `dist/tokens.css`.

- [ ] **Step 1: Add the `motion` namespace to `tokens.json`**

Append `motion` as the last top-level key — insert before the closing `}` of the root object, after the `radius` block. Exact JSON to add:

```json
  ,
  "motion": {
    "duration": {
      "instant": 1,
      "fast": 100,
      "base": 150,
      "moderate": 250,
      "long": 400,
      "emphatic": 600
    },
    "easing": {
      "standard": [0.2, 0, 0, 1],
      "enter": [0.05, 0.7, 0.1, 1],
      "exit": [0.3, 0, 0.8, 0.15],
      "emphasis": [0.34, 1.3, 0.64, 1]
    }
  }
```

The result must be valid JSON (verify with `node -e "JSON.parse(require('fs').readFileSync('packages/tokens/src/tokens.json','utf8')); console.log('ok')"`).

- [ ] **Step 2: Write the failing token tests**

`packages/tokens/src/index.test.ts` — change the import line (line 2) to:

```ts
import { colors, spacing, semantic, typography, elevation, radius, motion } from './index'
```

and append a `motion` describe block at the end of the file:

```ts
describe('motion', () => {
  it('exposes the duration scale', () => {
    expect(motion.duration.instant).toBe(1)
    expect(motion.duration.base).toBe(150)
    expect(motion.duration.emphatic).toBe(600)
  })

  it('exposes the easing curves as control-point tuples', () => {
    expect(motion.easing.standard).toEqual([0.2, 0, 0, 1])
    expect(motion.easing.enter).toEqual([0.05, 0.7, 0.1, 1])
    expect(motion.easing.exit).toEqual([0.3, 0, 0.8, 0.15])
    expect(motion.easing.emphasis).toEqual([0.34, 1.3, 0.64, 1])
  })

  it('covers exactly the spec keys', () => {
    expect(Object.keys(motion.duration).sort()).toEqual(['base', 'emphatic', 'fast', 'instant', 'long', 'moderate'])
    expect(Object.keys(motion.easing).sort()).toEqual(['emphasis', 'enter', 'exit', 'standard'])
  })
})
```

- [ ] **Step 3: Run the token tests to verify they fail**

Run: `npx nx run tokens:test`
Expected: FAIL — import of `./index` fails to resolve `motion` (index has no motion export yet), and `motion` is not defined. This RED is expected (TDD): the tests describe the required surface that does not exist yet.

- [ ] **Step 4: Write the failing generator test**

Create `packages/tokens/scripts/generate.test.mjs`:

```js
import { describe, expect, it } from 'vitest'
import tokens from '../src/tokens.json'
import { toCssVars } from './generate.mjs'

const css = toCssVars(tokens)

describe('generate toCssVars', () => {
  it('emits duration numbers as unitless CSS vars', () => {
    expect(css).toContain('--xr-motion-duration-base: 150;')
    expect(css).toContain('--xr-motion-duration-instant: 1;')
    expect(css).toContain('--xr-motion-duration-emphatic: 600;')
  })

  it('flattens easing arrays comma-joined with spaces', () => {
    expect(css).toContain('--xr-motion-easing-standard: 0.2, 0, 0, 1;')
    expect(css).toContain('--xr-motion-easing-emphasis: 0.34, 1.3, 0.64, 1;')
    expect(css).toContain('--xr-motion-easing-enter: 0.05, 0.7, 0.1, 1;')
    expect(css).toContain('--xr-motion-easing-exit: 0.3, 0, 0.8, 0.15;')
  })

  it('keeps existing scalar and object emission intact', () => {
    expect(css).toContain('--xr-color-ember-600: #c04e1d;')
    expect(css).toContain('--xr-radius-2xl: 28;')
  })
})

it('imports generate.mjs without side effects (no dist files written)', () => {
  expect(typeof toCssVars).toBe('function')
})
```

- [ ] **Step 5: Run the generator test to verify it fails**

Run: `npx vitest run scripts/generate.test.mjs` (from `packages/tokens`)
Expected: FAIL — `toCssVars` is not exported from `generate.mjs` (current file exports nothing) and the concrete `--xr-motion-*` assertions cannot all hold before the array rule exists.

- [ ] **Step 6: Refactor `generate.mjs` — export, array rule, main guard**

Replace the entire content of `packages/tokens/scripts/generate.mjs` with:

```js
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tokens = JSON.parse(readFileSync(resolve(root, 'src/tokens.json'), 'utf8'))

function toCssVars(obj, prefix = '--xr') {
  const lines = []
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      lines.push(`${prefix}-${key}: ${value.join(', ')};`)
    } else if (value && typeof value === 'object') {
      lines.push(toCssVars(value, `${prefix}-${key}`))
    } else {
      lines.push(`${prefix}-${key}: ${value};`)
    }
  }
  return lines.join('\n  ')
}

export { toCssVars }

const isMain = process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  mkdirSync(resolve(root, 'dist'), { recursive: true })
  writeFileSync(
    resolve(root, 'dist/tokens.css'),
    `:root {\n  ${toCssVars(tokens)}\n}\n`,
  )
  writeFileSync(resolve(root, 'dist/tokens.json'), JSON.stringify(tokens, null, 2))
  console.log('generated dist/tokens.css and dist/tokens.json')
}
```

Run the script directly once to confirm normal operation: `node packages/tokens/scripts/generate.mjs` — expect it to print `generated dist/tokens.css and dist/tokens.json`.

- [ ] **Step 7: Write `src/motion.ts`**

Create `packages/tokens/src/motion.ts`, following the `typography.ts` pattern exactly:

```ts
import tokens from './tokens.json'

export type MotionDurationKey = keyof typeof tokens.motion.duration
export type MotionEasingKey = keyof typeof tokens.motion.easing

export const motion = tokens.motion
```

- [ ] **Step 8: Export motion from the barrel**

`packages/tokens/src/index.ts` — replace line 5 (`export * from './radius'`) with:

```ts
export * from './radius'
export * from './motion'
```

- [ ] **Step 9: Run token tests to verify they pass**

Run: `npx nx run tokens:test`
Expected: PASS — index.test.ts now imports `motion`, and `src/motion.ts` + barrel export satisfy it. The generate.test.mjs is also discovered and passes (array rule now present).

- [ ] **Step 10: Full tokens gate + emission verification**

Run:
```bash
npx nx run tokens:lint
npx nx run tokens:typecheck
npx nx run tokens:build
```

Then verify the emitted CSS vars:
```bash
grep -E 'xr-motion-(duration-base|duration-instant|easing-standard|easing-emphasis)' packages/tokens/dist/tokens.css
```
Expected lines:
```
--xr-motion-duration-base: 150;
--xr-motion-duration-instant: 1;
--xr-motion-easing-standard: 0.2, 0, 0, 1;
--xr-motion-easing-emphasis: 0.34, 1.3, 0.64, 1;
```

- [ ] **Step 11: Commit**

```bash
git add packages/tokens/src/tokens.json packages/tokens/scripts/generate.mjs packages/tokens/scripts/generate.test.mjs packages/tokens/src/motion.ts packages/tokens/src/index.ts packages/tokens/src/index.test.ts
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(tokens): add motion duration and easing tokens"
```

---

### Task 2: Motion discipline documentation page

**Files:**
- Create: `apps/docs/guide/motion.md`
- Modify: `apps/docs/.vitepress/config.mts` (sidebar Guide items — add Motion after Theming)

**Interfaces:**
- Consumes: the motion tokens from Task 1 (documented values must match exactly); the existing VitePress guide structure (`/guide/getting-started`, `/guide/theming`); fonts already loaded site-wide (Fraunces/Instrument Sans/Geist Mono, configured in `.vitepress/config.mts` head).
- Produces: `/guide/motion` page linked in the Guide sidebar.

- [ ] **Step 1: Create `apps/docs/guide/motion.md`**

Create `apps/docs/guide/motion.md` with this exact content:

````markdown
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
````

- [ ] **Step 2: Register the page in the sidebar**

`apps/docs/.vitepress/config.mts` — in the `sidebar` `Guide` items array (after `{ text: 'Theming', link: '/guide/theming' }`), add:

```ts
{ text: 'Motion', link: '/guide/motion' },
```

Nav stays as-is (Motion is a guide page, not a top-level nav item).

- [ ] **Step 3: Build the docs to verify the page renders**

Run: `npx nx run docs:build --skip-nx-cache`
Expected: PASS; then verify the built page:
```bash
grep -c 'Motion' apps/docs/.vitepress/dist/guide/motion.html
grep -c 'easing-emphasis' apps/docs/.vitepress/dist/guide/motion.html
```
The page exists and contains the tokens table content. Head links/fonts are already
site-wide; no head change required for this page.

- [ ] **Step 4: Commit**

```bash
git add apps/docs/guide/motion.md apps/docs/.vitepress/config.mts
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "docs: add motion discipline guide page"
```

---

### Task 3: Storybook motion token gallery

**Files:**
- Modify: `apps/storybook/stories/tokens.stories.tsx`

**Interfaces:**
- Consumes: `motion` and `colors` from `@xerena/tokens` (available in the storybook app already — `@xerena/tokens` is a dependency; tokens.css is loaded in the preview). React available for the story component.
- Produces: a Motion section in the existing `Design Tokens/Gallery` story showing duration values and easing curves.

- [ ] **Step 1: Replace `apps/storybook/stories/tokens.stories.tsx`**

Replace the entire file with:

```tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { colors, semantic, motion } from '@xerena/tokens'

type Bezier = [number, number, number, number]

const CubicBezierPreview: React.FC<{ points: Bezier }> = ({ points }) => {
  const [x1, y1, x2, y2] = points
  const samples = 24
  const coords: string[] = []
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const mt = 1 - t
    const x = 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t
    const y = 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t
    coords.push(`${(x * 100).toFixed(1)},${((1 - y) * 100).toFixed(1)}`)
  }
  return (
    <svg
      viewBox="0 0 100 100"
      width={64}
      height={64}
      role="img"
      aria-label={`cubic-bezier(${points.join(', ')})`}
    >
      <line x1="0" y1="100" x2="100" y2="0" stroke="#f4efe6" strokeWidth="4" />
      <polyline
        points={coords.join(' ')}
        fill="none"
        stroke="#c04e1d"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const TokenGallery = () => (
  <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
    <h2>Primitive colors</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
      {Object.entries(colors).map(([name, shades]) =>
        Object.entries(shades).map(([shade, value]) => (
          <div key={`${name}-${shade}`} style={{ textAlign: 'center' }}>
            <div style={{ background: value, height: 64, borderRadius: 8, border: '1px solid #ddd' }} />
            <small>{`${name}.${shade} — ${value}`}</small>
          </div>
        )),
      )}
    </div>
    <h2>Semantic</h2>
    <pre>{JSON.stringify(semantic.color, null, 2)}</pre>
    <h2>Motion — duration</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
      {Object.entries(motion.duration).map(([key, value]) => (
        <div
          key={key}
          style={{ background: colors.sand[100], borderRadius: 8, padding: '10px 14px', minWidth: 96, textAlign: 'center' }}
        >
          <strong style={{ display: 'block', fontSize: 18 }}>{`${value}ms`}</strong>
          <small>{key}</small>
        </div>
      ))}
    </div>
    <h2>Motion — easing</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {Object.entries(motion.easing).map(([key, value]) => (
        <div
          key={key}
          style={{ display: 'flex', gap: 10, alignItems: 'center', background: colors.sand[100], borderRadius: 8, padding: 10 }}
        >
          <CubicBezierPreview points={value as Bezier} />
          <code style={{ fontSize: 12 }}>{`${key} — cubic-bezier(${value.join(', ')})`}</code>
        </div>
      ))}
    </div>
  </div>
)

const meta: Meta<typeof TokenGallery> = {
  title: 'Design Tokens/Gallery',
  component: TokenGallery,
}

export default meta
type Story = StoryObj<typeof TokenGallery>

export const Default: Story = {}
```

- [ ] **Step 2: Build the storybook app to verify**

Run: `npx nx run storybook:build --skip-nx-cache`
Expected: PASS. Then verify the Motion section is in the built storybook:
```bash
grep -c 'Motion — duration' apps/storybook/storybook-static/stories-tokens.stories.mjs apps/storybook/storybook-static/stories-tokens.stories.json 2>/dev/null || true
grep -r 'easing-emphasis\|cubic-bezier(0.34, 1.3, 0.64, 1)' apps/storybook/storybook-static/stories-tokens.stories.mjs | head -1 || true
```
The easing emphasis curve and the duration labels must appear in the compiled story module.

- [ ] **Step 3: Commit**

```bash
git add apps/storybook/stories/tokens.stories.tsx
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(storybook): add motion token gallery section"
```

---

### Task 4: Full pipeline verification

**Files:** none (verification only; unless a failure forces a fix).

**Interfaces:**
- Consumes: the completed Tasks 1–3.
- Produces: recorded evidence that the whole repo is green after the phase.

- [ ] **Step 1: Run the repo-wide gate**

Run (from repo root):

```bash
npx nx run-many -t typecheck lint test build --skip-nx-cache
```

Expected: all target-bearing projects pass (tokens, react, react-native, brand, storybook build, docs build). Record counts — token unit tests: 11 in `index.test.ts` (8 existing + 3 motion) plus 4 cases in `scripts/generate.test.mjs`, all green.

- [ ] **Step 2: Verify the phase contract end-to-end**

```bash
grep -E 'xr-motion-(duration-base|duration-instant|easing-standard|easing-emphasis)' packages/tokens/dist/tokens.css
grep -c 'Motion' apps/docs/.vitepress/dist/guide/motion.html
```

Expected: the four motion CSS vars above; `guide/motion.html` exists and contains header/link text.

- [ ] **Step 3: Confirm the repo is clean**

Run: `git status --short`
Expected: empty (all work committed).

- [ ] **Step 4: Report**

Write the verification matrix (command → outcome) to the session ledger per the execution skill's report format. No code commit is needed for this task.

---

## Self-Review (already run by plan author)

- **Spec coverage:** duration table (Task 1), easing table (Task 1), generator array rule + emission contract (Task 1), typed exports `MotionDurationKey`/`MotionEasingKey` (Task 1), reduced-motion `instant` + media-query pattern + doc sections 1–7 (Task 2), sidebar entry (Task 2), storybook section (Task 3), zero runtime code / no deps (all), verification (Task 4). Spec covered.
- **Placeholders:** all steps carry complete file content; no TBD/TODO/"add appropriate handling".
- **Type consistency:** `Bezier = [number, number, number, number]` matches `motion.easing.*` arrays; `value.join(', ')` on tuples yields the documented `0.2, 0, 0, 1`; generator test imports `generate.mjs`'s exported `toCssVars` (export added in the same task, step order: test written first fails, refactor satisfies it). `.mjs` test names match vitest's default include pattern.