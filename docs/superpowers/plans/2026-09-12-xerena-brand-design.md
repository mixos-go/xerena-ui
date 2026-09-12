# Xerena — Brand Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Land the Xerena brand identity as design tokens in `@xerena/tokens`, a new `@xerena/brand` package (mark/wordmark/lockup), and Storybook/Docs theming.

**Architecture:** Warm Craft editorial identity (ember copper accent, sand neutral ramp, Fraunces + Instrument Sans + Geist Mono). Brand tokens are plain-data namespace additions to `tokens.json` (same flat-key pattern as the existing `color`/`spacing` maps); `@xerena/brand` is a new React package consuming `@xerena/tokens` as its single source of truth, explicitly independent of `@xerena/react`.

**Tech Stack:** TypeScript, Vite (`vite-plugin-dts`), Vitest + Testing Library (+ jest-dom), tsup/`generate.mjs`, Nx, Storybook 8 (react-vite), VitePress.

**Spec:** `docs/superpowers/specs/2026-09-12-xerena-brand-design.md` — the plan argues from the spec; executors read both.

## Global Constraints

- Color keys stay **flat** (`.ember` / `.sand`), never nested under a `brand` group; `ColorShade` remains `50|100|500|600|700|900`.
- Remove `color.blue`; rename `color.gray` → `color.sand`. All existing references (`index.test.ts`, `docs/guide/theming.md`) must be updated.
- Exact ramp values: `ember` = `#fdf1e9`/`#f9e0cd`/`#d97b45`/`#c04e1d`/`#9c3a13`/`#52200c` (50/100/500/600/700/900); `sand` = `#faf7f2`/`#f4efe6`/`#9a8f7e`/`#7c7263`/`#5a5245`/`#2b2620`.
- Semantic aliases: `primary=ember.600`, `primaryHover=ember.700`, `background=sand.50`, `surface=sand.100`, `text=sand.900`, `textMuted=sand.500`, `border=sand.100`.
- Font stacks verbatim: `display = 'Fraunces, Georgia, serif'`, `body = 'Instrument Sans, system-ui, sans-serif'`, `mono = 'Geist Mono, ui-monospace, monospace'`.
- Type scale (display xs/sm/md/lg/xl, body sm/md/lg, mono sm/md/lg) uses the exact numbers in the spec table.
- Elevation shadows use ink `rgba(43,38,32,…)` at low alpha; `raised = md` value, `overlay = lg` value (exact strings below).
- Radius scale: `none(0) sm(4) md(8) lg(12) xl(20) 2xl(28) 3xl(36) 4xl(44) full(9999)`. `full` is for small elements only.
- **No `@font-face` files in `@xerena/tokens`.** Fonts load at app level via Google Fonts CDN links (Storybook `fonts.css`, docs `head`).
- **`@xerena/brand` must not import `@xerena/react`** (enforced by eslint boundary). It may import `@xerena/tokens`. Canonical size mappings: `sm=24`, `md=32`, `lg=48`.
- Borderless principle: no new borders in stories/demos; elevation/bg shows depth.
- **No animation implementation in any task.** Motion is principles-only this phase.

---

### Task 1: Brand token foundation in `@xerena/tokens`

Rewrites the primitive & semantic token data, adds three new exported namespaces (`typography`, `elevation`, `radius`), updates the tests. No component behavior anywhere else.

**Files:**
- Modify: `packages/tokens/src/tokens.json` (rewrite)
- Modify: `packages/tokens/src/semantic/index.ts`
- Modify: `packages/tokens/src/index.ts` (add exports)
- Create: `packages/tokens/src/typography.ts`
- Create: `packages/tokens/src/elevation.ts`
- Create: `packages/tokens/src/radius.ts`
- Modify: `packages/tokens/src/index.test.ts`
- Untouched but implied: `packages/tokens/src/colors.ts`, `packages/tokens/src/spacing.ts`, `packages/tokens/scripts/generate.mjs`

**Interfaces:**
- Consumes: nothing outside this package.
- Produces (consumed by Tasks 2–4):
  - `colors.ember: Record<ColorShade, string>` (`ember[600] === '#c04e1d'`, `ember[100] === '#f9e0cd'`)
  - `colors.sand: Record<ColorShade, string>` (`sand[50] === '#faf7f2'`, `sand[900] === '#2b2620'`)
  - `typography.fontFamily.display/body/mono` (exact stacks above), `typography.display.{xs,sm,md,lg,xl}`, `typography.body.{sm,md,lg}`, `typography.mono.{sm,md,lg}`, each `{ fontSize: number; lineHeight: number; fontWeight: number; letterSpacing: string }`
  - `elevation: Record<'none'|'xs'|'sm'|'md'|'lg'|'raised'|'overlay', string>` where `raised === md` and `overlay === lg`
  - `radius: Record<'none'|'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'|'4xl'|'full', number>`
  - `semantic.color.primary/primaryHover/background/surface/text/textMuted/border` aliases above
  - Emitted CSS vars in `dist/tokens.css`: `--xr-color-ember-600`, `--xr-color-sand-50`, `--xr-typography-fontFamily-display`, `--xr-elevation-md`, `--xr-radius-2xl`

- [ ] **Step 1: Rewrite `packages/tokens/src/tokens.json`**

```json
{
  "color": {
    "ember": {
      "50": "#fdf1e9",
      "100": "#f9e0cd",
      "500": "#d97b45",
      "600": "#c04e1d",
      "700": "#9c3a13",
      "900": "#52200c"
    },
    "sand": {
      "50": "#faf7f2",
      "100": "#f4efe6",
      "500": "#9a8f7e",
      "600": "#7c7263",
      "700": "#5a5245",
      "900": "#2b2620"
    }
  },
  "spacing": {
    "0": 0,
    "1": 4,
    "2": 8,
    "3": 12,
    "4": 16,
    "6": 24,
    "8": 32,
    "12": 48,
    "16": 64
  },
  "typography": {
    "fontFamily": {
      "display": "Fraunces, Georgia, serif",
      "body": "Instrument Sans, system-ui, sans-serif",
      "mono": "Geist Mono, ui-monospace, monospace"
    },
    "display": {
      "xs": { "fontSize": 24, "lineHeight": 32, "fontWeight": 500, "letterSpacing": "-0.01em" },
      "sm": { "fontSize": 30, "lineHeight": 38, "fontWeight": 500, "letterSpacing": "-0.015em" },
      "md": { "fontSize": 38, "lineHeight": 46, "fontWeight": 500, "letterSpacing": "-0.02em" },
      "lg": { "fontSize": 48, "lineHeight": 56, "fontWeight": 600, "letterSpacing": "-0.02em" },
      "xl": { "fontSize": 60, "lineHeight": 68, "fontWeight": 600, "letterSpacing": "-0.02em" }
    },
    "body": {
      "sm": { "fontSize": 14, "lineHeight": 20, "fontWeight": 400, "letterSpacing": "0" },
      "md": { "fontSize": 16, "lineHeight": 24, "fontWeight": 400, "letterSpacing": "0" },
      "lg": { "fontSize": 18, "lineHeight": 28, "fontWeight": 400, "letterSpacing": "0" }
    },
    "mono": {
      "sm": { "fontSize": 13, "lineHeight": 20, "fontWeight": 400, "letterSpacing": "0" },
      "md": { "fontSize": 14, "lineHeight": 22, "fontWeight": 400, "letterSpacing": "0" },
      "lg": { "fontSize": 16, "lineHeight": 24, "fontWeight": 400, "letterSpacing": "0" }
    }
  },
  "elevation": {
    "none": "none",
    "xs": "0 1px 2px rgba(43,38,32,0.04), 0 2px 4px rgba(43,38,32,0.04)",
    "sm": "0 2px 6px -1px rgba(43,38,32,0.06), 0 4px 12px -2px rgba(43,38,32,0.06)",
    "md": "0 4px 12px -2px rgba(43,38,32,0.08), 0 10px 28px -6px rgba(43,38,32,0.10)",
    "lg": "0 8px 24px -4px rgba(43,38,32,0.10), 0 18px 48px -12px rgba(43,38,32,0.14)",
    "raised": "0 4px 12px -2px rgba(43,38,32,0.08), 0 10px 28px -6px rgba(43,38,32,0.10)",
    "overlay": "0 8px 24px -4px rgba(43,38,32,0.10), 0 18px 48px -12px rgba(43,38,32,0.14)"
  },
  "radius": {
    "none": 0,
    "sm": 4,
    "md": 8,
    "lg": 12,
    "xl": 20,
    "2xl": 28,
    "3xl": 36,
    "4xl": 44,
    "full": 9999
  }
}
```

- [ ] **Step 2: Update `packages/tokens/src/semantic/index.ts`**

Replace the whole file body:

```ts
import { colors } from '../colors'
import { spacing } from '../spacing'

export const semantic = {
  color: {
    primary: colors.ember[600],
    primaryHover: colors.ember[700],
    background: colors.sand[50],
    surface: colors.sand[100],
    text: colors.sand[900],
    textMuted: colors.sand[500],
    border: colors.sand[100],
  },
  spacing: {
    xs: spacing[1],
    sm: spacing[2],
    md: spacing[4],
    lg: spacing[6],
    xl: spacing[8],
  },
} as const
```

- [ ] **Step 3: Create `packages/tokens/src/typography.ts`**

```ts
import tokens from './tokens.json'

export type TypographyFamilyName = keyof typeof tokens.typography.fontFamily
export type DisplaySizeKey = keyof typeof tokens.typography.display
export type BodySizeKey = keyof typeof tokens.typography.body
export type MonoSizeKey = keyof typeof tokens.typography.mono

export const typography = tokens.typography
```

- [ ] **Step 4: Create `packages/tokens/src/elevation.ts`**

```ts
import tokens from './tokens.json'

export type ElevationLevel = keyof typeof tokens.elevation

export const elevation = tokens.elevation as Record<ElevationLevel, string>
```

- [ ] **Step 5: Create `packages/tokens/src/radius.ts`**

```ts
import tokens from './tokens.json'

export type RadiusKey = keyof typeof tokens.radius

export const radius = tokens.radius as Record<RadiusKey, number>
```

- [ ] **Step 6: Update `packages/tokens/src/index.ts`**

```ts
export * from './colors'
export * from './spacing'
export * from './typography'
export * from './elevation'
export * from './radius'
export * from './semantic'
```

- [ ] **Step 7: Rewrite `packages/tokens/src/index.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { colors, spacing, semantic, typography, elevation, radius } from './index'

describe('color', () => {
  it('exposes the ember ramp', () => {
    expect(colors.ember[600]).toBe('#c04e1d')
    expect(colors.ember[50]).toBe('#fdf1e9')
  })

  it('exposes the sand ramp', () => {
    expect(colors.sand[50]).toBe('#faf7f2')
    expect(colors.sand[900]).toBe('#2b2620')
  })
})

describe('spacing', () => {
  it('exposes the spacing scale', () => {
    expect(spacing[4]).toBe(16)
  })
})

describe('typography', () => {
  it('exposes font family tokens', () => {
    expect(typography.fontFamily.display).toBe('Fraunces, Georgia, serif')
    expect(typography.fontFamily.body).toContain('Instrument Sans')
    expect(typography.fontFamily.mono).toContain('Geist Mono')
  })

  it('exposes the display scale', () => {
    expect(typography.display.xl.fontSize).toBe(60)
    expect(typography.display.xs.lineHeight).toBe(32)
  })
})

describe('elevation', () => {
  it('exposes the borderless shadow scale', () => {
    expect(elevation.none).toBe('none')
    expect(elevation.md).toContain('rgba(43,38,32,0.08)')
    expect(elevation.raised).toBe(elevation.md)
    expect(elevation.overlay).toBe(elevation.lg)
  })
})

describe('radius', () => {
  it('exposes the radius scale including large card sizes', () => {
    expect(radius.none).toBe(0)
    expect(radius['2xl']).toBe(28)
    expect(radius['4xl']).toBe(44)
    expect(radius.full).toBe(9999)
  })
})

describe('semantic', () => {
  it('resolves semantic aliases to primitives', () => {
    expect(semantic.color.primary).toBe(colors.ember[600])
    expect(semantic.color.primaryHover).toBe(colors.ember[700])
    expect(semantic.color.background).toBe(colors.sand[50])
    expect(semantic.spacing.md).toBe(spacing[4])
  })
})
```

- [ ] **Step 8: Run the tests — new tests must fail on the old data**

Run: `npx nx run tokens:test`
Expected: FAIL — e.g. `expect(colors.ember[600])` is `undefined`/types error because `blue`/`gray` still exist and `ember` does not.

- [ ] **Step 9: Verify lint, typecheck, and build (regenerates `dist/tokens.css`)**

```bash
npx nx run tokens:lint
npx nx run tokens:typecheck
npx nx run tokens:build
```

Expected: all pass; `dist/tokens.css` now contains `--xr-color-ember-600: #c04e1d;` and `--xr-radius-2xl: 28;`. Then run `npx nx run tokens:test` again — expected PASS (green).

- [ ] **Step 10: Commit**

```bash
git add packages/tokens
git commit -m "feat(tokens): add ember/sand brand palette, typography, elevation, radius"
```

---

### Task 2: `@xerena/brand` package — mark, wordmark, lockup, assets

Scaffolds the new package (mirroring `packages/react`), test-first implements the three identity components and the static SVG assets, wires the Nx graph and root scripts.

**Files:**
- Create: `packages/brand/package.json`, `packages/brand/tsconfig.json`, `packages/brand/vite.config.ts`, `packages/brand/vitest.setup.ts`, `packages/brand/eslint.config.js`, `packages/brand/project.json`, `packages/brand/scripts/copy-assets.mjs`
- Create: `packages/brand/src/index.ts`, `packages/brand/src/mark.tsx`, `packages/brand/src/wordmark.tsx`, `packages/brand/src/lockup.tsx`
- Create: `packages/brand/src/mark.test.tsx`, `packages/brand/src/wordmark.test.tsx`, `packages/brand/src/lockup.test.tsx`
- Create: `packages/brand/assets/mark.svg`, `packages/brand/assets/lockup.svg`, `packages/brand/assets/mark-og.svg`
- Modify: `package.json` (root scripts: add `brand` to `--projects` lists)
- Run: `pnpm install` (registers the new workspace package; commits updated lockfile)

**Interfaces:**
- Consumes: `colors.ember` / `colors.sand`, `typography.fontFamily` from `@xerena/tokens` (source, via vitest alias + tsconfig path).
- Produces (consumed by Task 3 stories, Task 4 docs): package `@xerena/brand` with exports:
  - `XerenaMark(props: { size?: 'sm'|'md'|'lg', tone?: 'default'|'onDark', title?: string, className?: string, style?: CSSProperties })` — `<svg role="img">`, default `aria-label="Xerena"`, pixel dims `sm=24 md=32 lg=48`.
  - `XerenaWordmark(props: { variant?: 'default'|'italic', weight?: 400|500|600, className?: string, style?: CSSProperties })` — `<span>` with `fontFamily: typography.fontFamily.display`.
  - `XerenaLockup(props: { variant?: 'horizontal'|'stacked', markSize?: 'sm'|'md'|'lg', tone?: 'default'|'onDark', className?: string, style?: CSSProperties })` — mark + wordmark; text `sand[900]` default, `sand[50]` on onDark.
  - Raw SVG subpath exports: `@xerena/brand/assets/mark.svg`, `.../lockup.svg`, `.../mark-og.svg` (copied to `dist/assets/` at build).

- [ ] **Step 1: Scaffold package config files**

`packages/brand/package.json`:

```json
{
  "name": "@xerena/brand",
  "version": "0.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./assets/mark.svg": "./dist/assets/mark.svg",
    "./assets/lockup.svg": "./dist/assets/lockup.svg",
    "./assets/mark-og.svg": "./dist/assets/mark-og.svg"
  },
  "files": ["dist"],
  "scripts": {
    "build": "vite build && node scripts/copy-assets.mjs"
  },
  "dependencies": {
    "@xerena/tokens": "workspace:*"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^25.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0",
    "vite-plugin-dts": "^4.0.0",
    "vitest": "^3.0.0"
  }
}
```

`packages/brand/tsconfig.json`:

```json
{
  "extends": "../../tools/tsconfig/tsconfig.react.json",
  "include": ["src", "vite.config.ts", "vitest.setup.ts"]
}
```

`packages/brand/vite.config.ts` (note the `resolve.alias` — it makes tests run against tokens **source**, not stale dist):

```ts
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts({ entryRoot: 'src', rollupTypes: true })],
  resolve: {
    alias: {
      '@xerena/tokens': resolve(import.meta.dirname, '../tokens/src/index.ts'),
    },
  },
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'XerenaBrand',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@xerena/tokens'],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
```

`packages/brand/vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

`packages/brand/eslint.config.js` (adds the boundary rule against `@xerena/react`):

```js
import base from '@xerena/eslint-config'

export default [
  ...base,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: '@xerena/native', message: 'web package must not import native' },
            { name: 'react-native', message: 'native code is not allowed here' },
            { name: '@xerena/react', message: 'brand package must not depend on @xerena/react' },
          ],
        },
      ],
    },
  },
]
```

`packages/brand/project.json`:

```json
{
  "name": "brand",
  "projectType": "library",
  "sourceRoot": "packages/brand/src",
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "options": { "command": "pnpm build", "cwd": "packages/brand" },
      "outputs": ["{projectRoot}/dist"]
    },
    "test": {
      "executor": "nx:run-commands",
      "options": { "command": "vitest run", "cwd": "packages/brand" },
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "executor": "nx:run-commands",
      "options": { "command": "tsc -p tsconfig.json --noEmit", "cwd": "packages/brand" }
    },
    "lint": {
      "executor": "nx:run-commands",
      "options": { "command": "eslint src", "cwd": "packages/brand" }
    }
  }
}
```

`packages/brand/scripts/copy-assets.mjs`:

```js
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
mkdirSync(resolve(root, 'dist/assets'), { recursive: true })
for (const name of ['mark.svg', 'lockup.svg', 'mark-og.svg']) {
  copyFileSync(resolve(root, 'assets', name), resolve(root, 'dist/assets', name))
}
console.log('copied dist/assets/*.svg')
```

- [ ] **Step 2: Register in root scripts + install**

In `/home/ubuntu/xerena-ui/package.json`, the three `--projects` lists become `tokens,react,react-native,brand`:

```json
"test": "nx run-many -t test --projects=tokens,react,react-native,brand",
"lint": "nx run-many -t lint --projects=tokens,react,react-native,brand",
"typecheck": "nx run-many -t typecheck --projects=tokens,react,react-native,brand",
```

Run: `pnpm install` (updates `pnpm-lock.yaml` with `@xerena/brand`).
Verify the project is discovered: Run `npx nx show projects` — expected output includes `brand`.

- [ ] **Step 3: Write the failing tests**

`packages/brand/src/mark.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { XerenaMark } from './mark'

describe('XerenaMark', () => {
  it('renders an identifiable mark', () => {
    render(<XerenaMark />)
    expect(screen.getByRole('img', { name: 'Xerena' })).toBeInTheDocument()
  })

  it('honours a custom title', () => {
    render(<XerenaMark title="Xerena logo" />)
    expect(screen.getByRole('img', { name: 'Xerena logo' })).toBeInTheDocument()
  })

  it('maps sizes to pixel dimensions', () => {
    const { container } = render(<XerenaMark size="lg" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '48')
    expect(svg).toHaveAttribute('height', '48')
  })
})
```

`packages/brand/src/wordmark.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { XerenaWordmark } from './wordmark'

describe('XerenaWordmark', () => {
  it('renders the brand name', () => {
    render(<XerenaWordmark />)
    expect(screen.getByText('Xerena')).toBeInTheDocument()
  })

  it('applies the display font family', () => {
    const { container } = render(<XerenaWordmark />)
    expect(container.querySelector('span')).toHaveStyle('font-family: Fraunces, Georgia, serif')
  })
})
```

`packages/brand/src/lockup.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { XerenaLockup } from './lockup'

describe('XerenaLockup', () => {
  it('renders mark and wordmark together', () => {
    render(<XerenaLockup />)
    expect(screen.getByText('Xerena')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Xerena' })).toBeInTheDocument()
  })

  it('stacks vertically on request', () => {
    const { container } = render(<XerenaLockup variant="stacked" />)
    expect(container.querySelector('span')).toHaveStyle('flex-direction: column')
  })
})
```

- [ ] **Step 4: Run tests — expect failures (modules do not exist yet)**

Run: `npx nx run brand:test --skip-nx-cache`
Expected: FAIL with module resolution errors (`Cannot find module './mark'`, etc.).

- [ ] **Step 5: Implement the components**

`packages/brand/src/index.ts`:

```ts
export * from './mark'
export * from './wordmark'
export * from './lockup'
```

`packages/brand/src/mark.tsx` (hexagon X, dimensional — gradient face, inner highlight, soft drop shadow):

```tsx
import { useId } from 'react'
import type { CSSProperties } from 'react'
import { colors } from '@xerena/tokens'

export type XerenaMarkSize = 'sm' | 'md' | 'lg'
export type XerenaMarkTone = 'default' | 'onDark'

export interface XerenaMarkProps {
  size?: XerenaMarkSize
  tone?: XerenaMarkTone
  title?: string
  className?: string
  style?: CSSProperties
}

const SIZE: Record<XerenaMarkSize, number> = { sm: 24, md: 32, lg: 48 }
const HEX = 'M24 2 L43.1 13 L43.1 35 L24 46 L4.9 35 L4.9 13 Z'

export function XerenaMark({
  size = 'md',
  tone = 'default',
  title = 'Xerena',
  className,
  style,
}: XerenaMarkProps) {
  const uid = useId()
  const faceId = `${uid}-face`
  const strokeId = `${uid}-stroke`
  const dark = tone === 'onDark'
  const dimension = SIZE[size]

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id={faceId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={dark ? colors.sand[700] : colors.sand[100]} />
          <stop offset="100%" stopColor={dark ? colors.sand[900] : colors.sand[50]} />
        </linearGradient>
        <linearGradient id={strokeId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors.ember[500]} />
          <stop offset="100%" stopColor={colors.ember[600]} />
        </linearGradient>
        <filter id={`${uid}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="rgba(43,38,32,0.10)" />
        </filter>
      </defs>
      <g filter={`url(#${uid}-shadow)`}>
        <path d={HEX} fill={`url(#${faceId})`} />
        <path
          d={HEX}
          fill="none"
          stroke={colors.ember[100]}
          strokeOpacity={dark ? 0.3 : 0.5}
          strokeWidth="1.5"
        />
      </g>
      <line
        x1="16.5"
        y1="31.5"
        x2="31.5"
        y2="16.5"
        stroke={`url(#${strokeId})`}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <line
        x1="16.5"
        y1="16.5"
        x2="31.5"
        y2="31.5"
        stroke={`url(#${strokeId})`}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <line x1="18.7" y1="29.3" x2="29.3" y2="18.7" stroke={colors.ember[100]} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.5" />
      <line x1="18.7" y1="18.7" x2="29.3" y2="29.3" stroke={colors.ember[100]} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.5" />
    </svg>
  )
}
```

`packages/brand/src/wordmark.tsx`:

```tsx
import type { CSSProperties } from 'react'
import { typography } from '@xerena/tokens'

export type XerenaWordmarkVariant = 'default' | 'italic'
export type XerenaWordmarkWeight = 400 | 500 | 600

export interface XerenaWordmarkProps {
  variant?: XerenaWordmarkVariant
  weight?: XerenaWordmarkWeight
  className?: string
  style?: CSSProperties
}

export function XerenaWordmark({
  variant = 'default',
  weight = 500,
  className,
  style,
}: XerenaWordmarkProps) {
  return (
    <span
      className={className}
      style={{
        fontFamily: typography.fontFamily.display,
        fontWeight: weight,
        fontStyle: variant === 'italic' ? 'italic' : 'normal',
        letterSpacing: '-0.02em',
        color: 'inherit',
        ...style,
      }}
    >
      Xerena
    </span>
  )
}
```

`packages/brand/src/lockup.tsx`:

```tsx
import type { CSSProperties } from 'react'
import { colors } from '@xerena/tokens'
import { XerenaMark } from './mark'
import type { XerenaMarkSize, XerenaMarkTone } from './mark'
import { XerenaWordmark } from './wordmark'

export type XerenaLockupVariant = 'horizontal' | 'stacked'

export interface XerenaLockupProps {
  variant?: XerenaLockupVariant
  markSize?: XerenaMarkSize
  tone?: XerenaMarkTone
  className?: string
  style?: CSSProperties
}

export function XerenaLockup({
  variant = 'horizontal',
  markSize = 'md',
  tone = 'default',
  className,
  style,
}: XerenaLockupProps) {
  const horizontal = variant === 'horizontal'
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: horizontal ? 'row' : 'column',
        alignItems: 'center',
        gap: horizontal ? 10 : 6,
        color: tone === 'onDark' ? colors.sand[50] : colors.sand[900],
        ...style,
      }}
    >
      <XerenaMark size={markSize} tone={tone} />
      <XerenaWordmark />
    </span>
  )
}
```

- [ ] **Step 6: Create the static SVG assets (mirror the component output 1:1)**

`packages/brand/assets/mark.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" role="img" aria-label="Xerena">
  <defs>
    <linearGradient id="xr-face" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f4efe6"/>
      <stop offset="100%" stop-color="#faf7f2"/>
    </linearGradient>
    <linearGradient id="xr-stroke" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#d97b45"/>
      <stop offset="100%" stop-color="#c04e1d"/>
    </linearGradient>
    <filter id="xr-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="rgba(43,38,32,0.10)"/>
    </filter>
  </defs>
  <g filter="url(#xr-shadow)">
    <path d="M24 2 L43.1 13 L43.1 35 L24 46 L4.9 35 L4.9 13 Z" fill="url(#xr-face)"/>
    <path d="M24 2 L43.1 13 L43.1 35 L24 46 L4.9 35 L4.9 13 Z" fill="none" stroke="#f9e0cd" stroke-opacity="0.5" stroke-width="1.5"/>
  </g>
  <line x1="16.5" y1="31.5" x2="31.5" y2="16.5" stroke="url(#xr-stroke)" stroke-width="9" stroke-linecap="round"/>
  <line x1="16.5" y1="16.5" x2="31.5" y2="31.5" stroke="url(#xr-stroke)" stroke-width="9" stroke-linecap="round"/>
  <line x1="18.7" y1="29.3" x2="29.3" y2="18.7" stroke="#f9e0cd" stroke-opacity="0.5" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="18.7" y1="18.7" x2="29.3" y2="29.3" stroke="#f9e0cd" stroke-opacity="0.5" stroke-width="2.5" stroke-linecap="round"/>
</svg>
```

`packages/brand/assets/lockup.svg` (horizontal lockup, viewBox `0 0 320 64`, mark scaled to 32px):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="64" viewBox="0 0 320 64" role="img" aria-label="Xerena">
  <defs>
    <linearGradient id="xl-face" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f4efe6"/>
      <stop offset="100%" stop-color="#faf7f2"/>
    </linearGradient>
    <linearGradient id="xl-stroke" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#d97b45"/>
      <stop offset="100%" stop-color="#c04e1d"/>
    </linearGradient>
  </defs>
  <g transform="translate(10 10) scale(0.667)">
    <path d="M24 2 L43.1 13 L43.1 35 L24 46 L4.9 35 L4.9 13 Z" fill="url(#xl-face)"/>
    <path d="M24 2 L43.1 13 L43.1 35 L24 46 L4.9 35 L4.9 13 Z" fill="none" stroke="#f9e0cd" stroke-opacity="0.5" stroke-width="1.5"/>
    <line x1="16.5" y1="31.5" x2="31.5" y2="16.5" stroke="url(#xl-stroke)" stroke-width="9" stroke-linecap="round"/>
    <line x1="16.5" y1="16.5" x2="31.5" y2="31.5" stroke="url(#xl-stroke)" stroke-width="9" stroke-linecap="round"/>
  </g>
  <text x="52" y="41" font-family="Fraunces, Georgia, serif" font-size="34" font-weight="500" letter-spacing="-0.02em" fill="#2b2620">Xerena</text>
</svg>
```

`packages/brand/assets/mark-og.svg` (og-format 1680×945, centered identity):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1680" height="945" viewBox="0 0 1680 945" role="img" aria-label="Xerena">
  <defs>
    <linearGradient id="og-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#faf7f2"/>
      <stop offset="100%" stop-color="#f4efe6"/>
    </linearGradient>
    <linearGradient id="og-stroke" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#d97b45"/>
      <stop offset="100%" stop-color="#c04e1d"/>
    </linearGradient>
  </defs>
  <rect width="1680" height="945" fill="url(#og-bg)"/>
  <g transform="translate(840 360)">
    <path d="M0 -110 L112 -46.5 L112 46.5 L0 110 L-112 46.5 L-112 -46.5 Z" fill="#f4efe6"/>
    <path d="M0 -110 L112 -46.5 L112 46.5 L0 110 L-112 46.5 L-112 -46.5 Z" fill="none" stroke="#f9e0cd" stroke-opacity="0.5" stroke-width="6"/>
    <line x1="-34" y1="76" x2="34" y2="-76" stroke="url(#og-stroke)" stroke-width="36" stroke-linecap="round"/>
    <line x1="-34" y1="-76" x2="34" y2="76" stroke="url(#og-stroke)" stroke-width="36" stroke-linecap="round"/>
  </g>
  <text x="840" y="580" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="120" font-weight="500" letter-spacing="-0.02em" fill="#2b2620">Xerena</text>
  <text x="840" y="650" text-anchor="middle" font-family="Instrument Sans, system-ui, sans-serif" font-size="36" fill="#9a8f7e">the calm center of complex systems</text>
</svg>
```

- [ ] **Step 7: Run tests, typecheck, lint, build**

```bash
npx nx run brand:test --skip-nx-cache
npx nx run brand:typecheck --skip-nx-cache
npx nx run brand:lint --skip-nx-cache
npx nx run brand:build --skip-nx-cache
```

Expected: all green. Verify the three SVGs landed in `dist/assets/` (`ls packages/brand/dist/assets`) and `dist/index.d.ts` exports the component types.

- [ ] **Step 8: Commit**

```bash
git add packages/brand package.json pnpm-lock.yaml
git commit -m "feat(brand): add @xerena/brand mark, wordmark, lockup and assets"
```

---

### Task 3: Storybook brand integration

Makes Storybook feel like Xerena, adds the “Brand — Xerena identity” showcase page, and the mark favicon via `managerHead`.

**Files:**
- Modify: `apps/storybook/.storybook/main.ts` (staticDirs + managerHead)
- Modify: `apps/storybook/.storybook/preview.tsx` (fonts + background + layout)
- Create: `apps/storybook/.storybook/fonts.css`
- Create: `apps/storybook/public/mark.svg` (copy of `packages/brand/assets/mark.svg`)
- Modify: `apps/storybook/package.json` (add `"@xerena/brand": "workspace:*"` dependency)
- Create: `apps/storybook/stories/brand.stories.tsx`
- Run: `pnpm install` (lockfile for the new storybook dependency)

**Interfaces:**
- Consumes: `XerenaMark`, `XerenaWordmark`, `XerenaLockup`, `colors`, `typography`, `elevation`, `radius` from the previous tasks.

- [ ] **Step 1: Update `apps/storybook/.storybook/main.ts`**

```ts
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['../public'],
  managerHead: (head) => head + '<link rel="icon" type="image/svg+xml" href="/mark.svg" />',
}

export default config
```

- [ ] **Step 2: Create `apps/storybook/.storybook/fonts.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..600&family=Instrument+Sans:wght@400;500&family=Geist+Mono:wght@400;500&display=swap');

body {
  font-family: 'Instrument Sans', system-ui, sans-serif;
}
```

- [ ] **Step 3: Update `apps/storybook/.storybook/preview.tsx`**

```tsx
import './fonts.css'
import type { Preview } from '@storybook/react'
import { Provider } from '@xerena/react'
import '@xerena/react/styles/base.css'
import '@xerena/tokens/tokens.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'sand',
      values: [{ name: 'sand', value: '#faf7f2' }],
    },
  },
  decorators: [
    (Story) => (
      <Provider>
        <Story />
      </Provider>
    ),
  ],
}

export default preview
```

- [ ] **Step 4: Add the brand dependency + favicon asset**

Add to `apps/storybook/package.json` `dependencies`:

```json
"@xerena/brand": "workspace:*"
```

Copy the mark asset: `cp packages/brand/assets/mark.svg apps/storybook/public/mark.svg`
Run: `pnpm install`

- [ ] **Step 5: Create `apps/storybook/stories/brand.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { colors, typography, elevation, radius } from '@xerena/tokens'
import { XerenaMark, XerenaWordmark, XerenaLockup } from '@xerena/brand'

const Showcase = () => (
  <div style={{ fontFamily: '"Instrument Sans", sans-serif', maxWidth: 720, padding: 40 }}>
    <h1 style={{ fontFamily: '"Fraunces", serif', fontWeight: 500, letterSpacing: '-0.02em' }}>
      Xerena identity
    </h1>

    <h2>Mark</h2>
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <XerenaMark size="sm" />
      <XerenaMark size="md" />
      <XerenaMark size="lg" />
      <div style={{ background: colors.sand[900], borderRadius: 12, padding: 16 }}>
        <XerenaMark tone="onDark" />
      </div>
    </div>

    <h2>Wordmark</h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <XerenaWordmark weight={500} style={{ fontSize: 32 }} />
      <XerenaWordmark variant="italic" weight={600} style={{ fontSize: 32 }} />
    </div>

    <h2>Lockup</h2>
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      <XerenaLockup />
      <XerenaLockup variant="stacked" markSize="sm" />
    </div>

    <h2>Palette</h2>
    {Object.entries(colors).map(([name, shades]) => (
      <div key={name} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        {Object.entries(shades).map(([shade, value]) => (
          <div
            key={shade}
            style={{
              width: 72,
              height: 72,
              background: value,
              borderRadius: 4,
              boxShadow: elevation.xs,
            }}
            title={`${name}.${shade} — ${value}`}
          />
        ))}
      </div>
    ))}

    <h2>Type specimen</h2>
    <p style={{ fontFamily: typography.fontFamily.body, margin: 0 }}>
      Instrument Sans — The calm center of complex systems.
    </p>
    <p style={{ fontFamily: typography.fontFamily.mono, margin: 0 }}>Geist Mono — 0x2B 0x26 0x20</p>
    <p
      style={{
        fontFamily: typography.fontFamily.display,
        fontSize: 38,
        fontWeight: 500,
        letterSpacing: '-0.02em',
        margin: 0,
      }}
    >
      Fraunces — serendipity
    </p>

    <h2>Elevation</h2>
    <div style={{ display: 'flex', gap: 16 }}>
      {(['xs', 'sm', 'md', 'lg'] as const).map((level) => (
        <div
          key={level}
          style={{ width: 96, height: 96, background: colors.sand[50], borderRadius: radius.md, boxShadow: elevation[level] }}
        />
      ))}
    </div>
  </div>
)

const meta: Meta<typeof Showcase> = {
  title: 'Brand/Xerena identity',
  component: Showcase,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof Showcase>

export const Default: Story = {}
```

- [ ] **Step 6: Build Storybook (headless-safe, no dev server needed)**

Run: `npx nx run storybook:build --skip-nx-cache`
Expected: build succeeds; `storybook-static/index.json` contains the `Brand/Xerena identity` story id; `storybook-static/mark.svg` exists (served from `public/` via `staticDirs`).

- [ ] **Step 7: Commit**

```bash
git add apps/storybook pnpm-lock.yaml
git commit -m "feat(storybook): brand fonts, favicon, and identity showcase"
```

---

### Task 4: Docs — Brand page, fonts, token docs

Adds the VitePress Brand page, loads the three fonts via config head, sets the mark favicon, and fixes the token references that the foundation phase left behind.

**Files:**
- Create: `apps/docs/brand.md`
- Create: `apps/docs/public/mark.svg` (copy of `packages/brand/assets/mark.svg`)
- Modify: `apps/docs/config.mts` (nav, sidebar, head)
- Modify: `apps/docs/index.md` (add `@xerena/brand` bullet)
- Modify: `apps/docs/guide/theming.md` (ember var + new namespaces)

**Interfaces:**
- Consumes: final token names/paths from Task 1 (static content only — no runtime import).

- [ ] **Step 1: Create `apps/docs/public/mark.svg`**

`cp packages/brand/assets/mark.svg apps/docs/public/mark.svg`

- [ ] **Step 2: Update `apps/docs/config.mts`**

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Xerena UI',
  description: 'Cross-platform design system for React and React Native',
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..600&family=Instrument+Sans:wght@400;500&family=Geist+Mono:wght@400;500&display=swap',
      },
    ],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/mark.svg' }],
  ],
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Brand', link: '/brand' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Theming', link: '/guide/theming' },
        ],
      },
      {
        text: 'Brand',
        items: [{ text: 'Identity', link: '/brand' }],
      },
    ],
  },
})
```

- [ ] **Step 3: Update `apps/docs/index.md`**

Add the brand package bullet under the package list:

```md
# Xerena UI

Cross-platform design system for React and React Native.

- `@xerena/tokens` — single source of truth design tokens
- `@xerena/react` — web components
- `@xerena/native` — React Native components
- `@xerena/brand` — logo identity assets (mark, wordmark, lockup)

Check the [Getting Started guide](/guide/getting-started).
```

- [ ] **Step 4: Update `apps/docs/guide/theming.md`**

Write the exact file content below (outer four-backtick fence is the plan's wrapper; the file itself contains a triple-backtick JSON fence):

````md
# Theming

Xerena UI uses a three-layer token architecture: primitive → semantic → component.

```json
{
  "color": {
    "primary": "var(--xr-color-ember-600)"
  }
}
```

Web consumes generated CSS variables (`@xerena/tokens/tokens.css`); React Native consumes the JSON token file (`@xerena/tokens/tokens.json`).

Primitive color scales: `color.ember` (accent, 50–900) and `color.sand` (warm neutrals, 50–900). The tokens package also exposes `typography` (Fraunces / Instrument Sans / Geist Mono), `elevation` (borderless soft shadows), and `radius` (none → full, including large card sizes 2xl–4xl). Fonts are loaded by the consuming app, not bundled in the tokens package.
````

- [ ] **Step 5: Create `apps/docs/brand.md`**

```md
# Brand — Xerena identity

> **Xerena, the calm center of complex systems.**

“Xerena” is “X” (the unknown, the forward) × “serene” (calm). The messiest surfaces — dense admin, streaming agent output — are exactly where a serene, precise interface pays off.

## Principles

1. **Borderless first.** Depth comes from tonal separation and soft elevation, never from visible borders.
2. **Warmth as intelligence.** Ember copper on warm sand reads human, not like another purple AI default.
3. **Editorial calm.** Fraunces + Instrument Sans lead; whitespace is kept.
4. **Motion is identity.** Smooth, interruptible motion is a brand promise (tokens arrive in the motion phase).
5. **Elevation speaks, borders stay silent.**

## Voice

Serene, precise, warm, forward. Calm, confident, never shouty.

## Palette

| token | 50 | 100 | 500 | 600 | 700 | 900 |
|---|---|---|---|---|---|---|
| `color.ember` | `#fdf1e9` | `#f9e0cd` | `#d97b45` | `#c04e1d` | `#9c3a13` | `#52200c` |
| `color.sand` | `#faf7f2` | `#f4efe6` | `#9a8f7e` | `#7c7263` | `#5a5245` | `#2b2620` |

Semantic aliases: `primary → ember.600`, `primaryHover → ember.700`, `background → sand.50`, `surface → sand.100`, `text → sand.900`, `textMuted → sand.500`.

## Typography

| role | family |
|---|---|
| Display | Fraunces (400–600, italics) |
| Body | Instrument Sans (400/500) |
| Mono | Geist Mono (tabular for data) |

Fonts are loaded by the consuming app (Storybook and these docs load them from Google Fonts CDN).

## Mark & wordmark

```tsx
import { XerenaMark, XerenaWordmark, XerenaLockup } from '@xerena/brand'

export function Hero() {
  return (
    <>
      <XerenaMark size="lg" />
      <XerenaWordmark weight={600} />
      <XerenaLockup variant="stacked" markSize="sm" />
    </>
  )
}
```

`XerenaMark` accepts `size` (`sm | md | lg`) and `tone` (`default | onDark`); it renders an `<svg role="img">` with a default `aria-label="Xerena"` — pass `title` to change it. The lockup mirrors the same props. Raw assets are also exported as `@xerena/brand/assets/mark.svg` etc. for favicons and social cards.
```

- [ ] **Step 6: Build docs to verify**

Run: `npx nx run docs:build --skip-nx-cache`
Expected: build succeeds, `apps/docs/.vitepress/dist/brand.html` exists, `dist/mark.svg` exists.

- [ ] **Step 7: Commit**

```bash
git add apps/docs
git commit -m "docs: add brand identity page and token references"
```

---

### Task 5: Full pipeline verification

Proves the whole monorepo is green with the brand work integrated, and that Storybook + Docs still build.

**Files:**
- No new files (verification only).

- [ ] **Step 1: Run the whole gate in dependency order**

Run:

```bash
npx nx run-many -t typecheck --skip-nx-cache
npx nx run-many -t lint --skip-nx-cache
npx nx run-many -t test --skip-nx-cache
npx nx run-many -t build --skip-nx-cache
npx nx run storybook:build --skip-nx-cache
npx nx run docs:build --skip-nx-cache
```

Expected: every target exits 0. In particular:
- `tokens:build` re-emits `dist/tokens.css` with `--xr-color-ember-600` / `--xr-radius-2xl`;
- `brand:test` passes (tokens resolved from source via the vitest alias);
- `storybook:build` succeeds and depends on `brand` + `tokens` builds;
- no eslint boundary violations (`brand` never imports `@xerena/react`).

- [ ] **Step 2: Inspect the dependency graph**

Run: `npx nx graph --file=/tmp/opencode/nx-graph-brand.json` and confirm nodes `tokens`, `brand`, `react`, `react-native`, `storybook`, `docs` are present and `brand:build` points at `tokens:build`.

- [ ] **Step 3: Commit (any incidental fixes)**

```bash
git add -A
git commit -m "chore: verify brand pipeline green"
```

(If no changes were needed, skip this commit.)

---

## Self-Review

**Spec coverage:** mark/wordmark/lockup → Task 2; `@xerena/brand` package → Task 2; tokens (`ember`, `sand`, typography, elevation, radius) → Task 1; `blue` removal + `gray`→`sand` + doc/test updates → Tasks 1 & 4; Storybook font/bg/favicon/showcase → Task 3; Docs brand page + fonts → Task 4; pipeline green → Task 5. Motion stays principles-only (no task animates anything). Raw assets (mark/lockup/mark-og svg) → Task 2 Step 6. `@xerena/brand` independence from `@xerena/react` → enforced by eslint boundary (Task 2 Step 1 config) and never imported anywhere.

**Placeholders:** none — every file has complete content.

**Type consistency:** `XerenaMarkProps`, `XerenaWordmarkProps`, `XerenaLockupProps` and their prop names (`size`, `tone`, `title`, `variant`, `weight`, `markSize`) are identical across Task 2 definitions and Task 3/4 usages. Token export names match: `colors.ember`, `colors.sand`, `typography.fontFamily.*`, `elevation` (levels `none|xs|sm|md|lg|raised|overlay`), `radius` (`none|sm|md|lg|xl|2xl|3xl|4xl|full`).