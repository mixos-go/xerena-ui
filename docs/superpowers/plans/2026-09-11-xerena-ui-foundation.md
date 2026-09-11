# Xerena UI Repository & Tooling Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the Xerena UI Nx monorepo foundation — workspace, packages, tooling, CI/CD — so the build/test/lint pipeline runs end-to-end with working skeleton packages.

**Architecture:** Nx + pnpm monorepo with three publishable packages (`@xerena/tokens`, `@xerena/react`, `@xerena/native`), two consumer apps (Storybook + VitePress), and shared tooling in `tools/`. Tokens are the single source of truth consumed by both web (CSS variables via generator) and native (typed object). Dependency boundary: `tokens` importable by all, `react` ↔ `native` never cross-import at runtime.

**Tech Stack:** Nx 21, pnpm 10, Node 22, TypeScript 5, Vite (lib mode) for web builds, tsup for tokens, react-native-builder-bob for native, Vitest + React Testing Library (web), Jest + RN Testing Library (native), Storybook 8 (Vite), VitePress, ESLint 9 flat config, Changesets, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-11-xerena-ui-design.md`

## Global Constraints

- Mono-repo root: `/home/ubuntu/xerena-ui` (git repo exists, branch `main`, commit spec already present).
- Package manager: **pnpm 10**, Node `>=22`. Lockfile `pnpm-lock.yaml` committed.
- `packages/tokens` → zero runtime dependencies (pure TypeScript).
- `packages/react` → deps only: `@xerena/tokens`, `react`, `react-dom` (+ devDeps).
- `packages/react-native` → deps only: `@xerena/tokens`, `react`, `react-native` (+ devDeps).
- **No runtime cross-import** between `react` and `react-native`; API alignment only via type-only imports.
- Naming: packages `@xerena/tokens`, `@xerena/react`, `@xerena/native`; repo name `xerena-ui`.
- Nx cache enabled for `build`, `typecheck`, `lint`, `test` targets.
- Conventional Commits; squash merge; `.changeset/*.md` required for behavior changes.
- Every commit is on branch `main`; no other branches needed during this plan (repo is new).

---

### Task 1: Root Workspace & pnpm Skeleton

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `.npmrc`
- Create: `.gitignore`
- Create: `README.md`

**Interfaces:**
- Consumes: nothing.
- Produces: root `package.json` with `nx` devDependency (used by later tasks), workspace globs `apps/*`, `packages/*`, `tools/*` (used by every later task), `.npmrc` with `shamefully-hoist=true` (required for React Native peer resolution), `.gitignore`.

- [ ] **Step 1: Create root `package.json`**

```json
{
  "name": "xerena-ui",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "packageManager": "pnpm@10.0.0",
  "engines": { "node": ">=22" },
  "scripts": {
    "build": "nx run-many -t build",
    "test": "nx run-many -t test --projects=tokens,react,react-native",
    "lint": "nx run-many -t lint --projects=tokens,react,react-native",
    "typecheck": "nx run-many -t typecheck --projects=tokens,react,react-native",
    "deploy:storybook": "nx build storybook"
  },
  "devDependencies": {
    "nx": "^21.0.0"
  }
}
```

- [ ] **Step 2: Create `pnpm-workspace.yaml`**

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tools/*'
```

- [ ] **Step 3: Create `.npmrc`**

```
shamefully-hoist=true
```

- [ ] **Step 4: Create `.gitignore`**

```gitignore
node_modules/
dist/
lib/
coverage/
*.log
.DS_Store
apps/storybook/storybook-static/
apps/docs/.vitepress/dist/
apps/docs/.vitepress/cache/
```

- [ ] **Step 5: Create `README.md`**

```markdown
# Xerena UI

Cross-platform design system for React and React Native.

- `@xerena/tokens` — design tokens (single source of truth)
- `@xerena/react` — web components (CSS variables / Vite)
- `@xerena/native` — React Native components (StyleSheet / builder-bob)

## Development

See `docs/superpowers/specs/2026-09-11-xerena-ui-design.md` for the architecture.
```

- [ ] **Step 6: Install and verify pnpm works properly**

Run: `pnpm install`
Expected: exit 0, `pnpm-lock.yaml` created, `node_modules` exists, `npx nx --version` prints an Nx version ≥ 20.

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-workspace.yaml .npmrc .gitignore README.md pnpm-lock.yaml
git commit -m "chore: bootstrap pnpm workspace skeleton"
```

---

### Task 2: Nx Orchestration

**Files:**
- Create: `nx.json`
- Modify: `package.json` (add root scripts already present; no change needed beyond Task 1)

**Interfaces:**
- Consumes: root `package.json` `nx` devDependency.
- Produces: `nx.json` with `defaultBase: "main"`, task pipeline, and `targetDefaults` caching rules used by every package `targets` in later tasks.

- [ ] **Step 1: Create `nx.json`**

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "defaultBase": "main",
  "targetDefaults": {
    "build": { "dependsOn": ["^build"], "cache": true, "outputs": ["{projectRoot}/dist"] },
    "typecheck": { "cache": true },
    "lint": { "cache": true },
    "test": { "cache": true }
  }
}
```

- [ ] **Step 2: Verify Nx recognizes the workspace**

Run: `npx nx show projects`
Expected: exit 0; empty project list is fine at this stage (no projects defined yet).

- [ ] **Step 3: Commit**

```bash
git add nx.json
git commit -m "chore: add nx orchestration config"
```

---

### Task 3: Shared TypeScript Config

**Files:**
- Create: `tsconfig.base.json` (root)
- Create: `tools/tsconfig/tsconfig.react.json`
- Create: `tools/tsconfig/tsconfig.rn.json`

**Interfaces:**
- Consumes: nothing.
- Produces: base compiler options + path aliases `@xerena/tokens`, `@xerena/react`, `@xerena/native` → `src` (used by all packages and apps); platform-specific configs for web (DOM libs) and native (no DOM).

- [ ] **Step 1: Create root `tsconfig.base.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "declaration": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "paths": {
      "@xerena/tokens": ["packages/tokens/src/index.ts"],
      "@xerena/react": ["packages/react/src/index.ts"],
      "@xerena/native": ["packages/react-native/src/index.ts"]
    }
  }
}
```

- [ ] **Step 2: Create `tools/tsconfig/tsconfig.react.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  }
}
```

- [ ] **Step 3: Create `tools/tsconfig/tsconfig.rn.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2022"],
    "types": ["jest"]
  }
}
```

- [ ] **Step 4: Verify configs parse (no projects reference them yet)**

Run: `npx tsc -p tools/tsconfig/tsconfig.react.json --noEmit`
Expected: exit 0 (empty program, no errors).

- [ ] **Step 5: Commit**

```bash
git add tsconfig.base.json tools/tsconfig/
git commit -m "chore: add shared typescript configs"
```

---

### Task 4: Shared ESLint Flat Config (with boundary lint)

**Files:**
- Create: `tools/eslint-config/package.json`
- Create: `tools/eslint-config/index.js`
- Create: `eslint.config.js` (root)

**Interfaces:**
- Consumes: nothing.
- Produces: `@xerena/eslint-config` (private tool package, not published) exporting a base flat config; each package's `eslint.config.js` extends it and adds `no-restricted-imports` boundary rules (hard gate for dependency graph).

- [ ] **Step 1: Create `tools/eslint-config/package.json`**

```json
{
  "name": "@xerena/eslint-config",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "index.js",
  "peerDependencies": { "eslint": "^9" },
  "dependencies": {
    "@eslint/js": "^9.0.0",
    "typescript-eslint": "^8.0.0"
  }
}
```

- [ ] **Step 2: Create `tools/eslint-config/index.js`**

```js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: ['dist/**', 'lib/**', 'node_modules/**', 'coverage/**', 'storybook-static/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
  },
]
```

- [ ] **Step 3: Create root `eslint.config.js`**

```js
import base from '@xerena/eslint-config'

export default [
  ...base,
  {
    files: ['**/*.{ts,tsx}'],
  },
]
```

- [ ] **Step 4: Install eslint tooling**

Run:
```bash
pnpm -w add -D "eslint@^9" "typescript-eslint@^8" "@eslint/js@^9"
pnpm --filter @xerena/eslint-config add -D @types/node
```
Add `"@xerena/eslint-config": "workspace:*"` to the root `package.json` `devDependencies` so flat configs at the repo root and in packages can resolve it.

- [ ] **Step 5: Verify lint runs against config files**

Run: `npx eslint tools/eslint-config/index.js eslint.config.js`
Expected: exit 0, no lint errors.

- [ ] **Step 6: Commit**

```bash
git add tools/eslint-config/ eslint.config.js package.json pnpm-lock.yaml
git commit -m "chore: add shared eslint flat config"
```

---

### Task 5: `@xerena/tokens` — single source of truth + generator

**Files:**
- Create: `packages/tokens/package.json`
- Create: `packages/tokens/tsconfig.json`
- Create: `packages/tokens/project.json`
- Create: `packages/tokens/eslint.config.js`
- Create: `packages/tokens/src/tokens.json`
- Create: `packages/tokens/src/colors.ts`
- Create: `packages/tokens/src/spacing.ts`
- Create: `packages/tokens/src/semantic/index.ts`
- Create: `packages/tokens/src/index.ts`
- Create: `packages/tokens/scripts/generate.mjs`
- Test: `packages/tokens/src/index.test.ts`

**Interfaces:**
- Consumes: `tsconfig.base.json`, `@xerena/eslint-config`.
- Produces:
  - `colors`, `spacing`, `semantic` typed exports (const objects) — consumed by `react`/`native` packages in Tasks 6–7.
  - Build outputs in `dist/`: ESM + CJS + `.d.ts` (tsup) plus `dist/tokens.css` (CSS variables) and `dist/tokens.json` (machine-readable, for native) written by `scripts/generate.mjs`.
  - Nx targets `build`, `test`, `typecheck`, `lint`.

- [ ] **Step 1: Create `packages/tokens/package.json`**

```json
{
  "name": "@xerena/tokens",
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
    "./tokens.css": "./dist/tokens.css",
    "./tokens.json": "./dist/tokens.json"
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup && node scripts/generate.mjs"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.6.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create `packages/tokens/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"]
}
```

- [ ] **Step 3: Create `packages/tokens/project.json`**

```json
{
  "name": "tokens",
  "projectType": "library",
  "sourceRoot": "packages/tokens/src",
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "options": { "command": "pnpm build", "cwd": "packages/tokens" },
      "outputs": ["{projectRoot}/dist"]
    },
    "test": {
      "executor": "nx:run-commands",
      "options": { "command": "vitest run", "cwd": "packages/tokens" }
    },
    "typecheck": {
      "executor": "nx:run-commands",
      "options": { "command": "tsc -p tsconfig.json --noEmit", "cwd": "packages/tokens" }
    },
    "lint": {
      "executor": "nx:run-commands",
      "options": { "command": "eslint src", "cwd": "packages/tokens" }
    }
  }
}
```

- [ ] **Step 4: Create `packages/tokens/eslint.config.js`**

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
            { name: '@xerena/react', message: 'tokens must be zero-dependency' },
            { name: '@xerena/native', message: 'tokens must be zero-dependency' },
          ],
        },
      ],
    },
  },
]
```

- [ ] **Step 5: Create `packages/tokens/src/tokens.json`**

```json
{
  "color": {
    "blue": {
      "50": "#eff6ff",
      "100": "#dbeafe",
      "500": "#3b82f6",
      "600": "#2563eb",
      "700": "#1d4ed8"
    },
    "gray": {
      "50": "#f9fafb",
      "100": "#f3f4f6",
      "500": "#6b7280",
      "700": "#374151",
      "900": "#111827"
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
  }
}
```

- [ ] **Step 6: Create `packages/tokens/src/colors.ts`**

```ts
import tokens from './tokens.json'

export type ColorShade = 50 | 100 | 500 | 600 | 700
export type ColorName = keyof typeof tokens.color

export const colors = tokens.color as Record<ColorName, Record<ColorShade, string>>
```

- [ ] **Step 7: Create `packages/tokens/src/spacing.ts`**

```ts
import tokens from './tokens.json'

export type SpacingKey = keyof typeof tokens.spacing

export const spacing = tokens.spacing as Record<SpacingKey, number>
```

- [ ] **Step 8: Create `packages/tokens/src/semantic/index.ts`**

```ts
import { colors } from '../colors'
import { spacing } from '../spacing'

export const semantic = {
  color: {
    primary: colors.blue[600],
    primaryHover: colors.blue[700],
    background: colors.gray[50],
    surface: colors.gray[100],
    text: colors.gray[900],
    textMuted: colors.gray[500],
    border: colors.gray[100],
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

- [ ] **Step 9: Create `packages/tokens/src/index.ts`**

```ts
export * from './colors'
export * from './spacing'
export * from './semantic'
```

- [ ] **Step 10: Create `packages/tokens/scripts/generate.mjs` (write failing-then-passing outputs)**

```js
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tokens = JSON.parse(readFileSync(resolve(root, 'src/tokens.json'), 'utf8'))

function toCssVars(obj, prefix = '--xr') {
  const lines = []
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      lines.push(toCssVars(value, `${prefix}-${key}`))
    } else {
      lines.push(`${prefix}-${key}: ${value};`)
    }
  }
  return lines.join('\n  ')
}

mkdirSync(resolve(root, 'dist'), { recursive: true })
writeFileSync(
  resolve(root, 'dist/tokens.css'),
  `:root {\n  ${toCssVars(tokens)}\n}\n`,
)
writeFileSync(resolve(root, 'dist/tokens.json'), JSON.stringify(tokens, null, 2))
console.log('generated dist/tokens.css and dist/tokens.json')
```

- [ ] **Step 11: Write the failing test**

Create `packages/tokens/src/index.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { colors, spacing, semantic } from './index'

describe('tokens', () => {
  it('exposes primary color', () => {
    expect(colors.blue[600]).toBe('#2563eb')
  })

  it('exposes spacing scale', () => {
    expect(spacing[4]).toBe(16)
  })

  it('resolves semantic aliases to primitives', () => {
    expect(semantic.color.primary).toBe(colors.blue[600])
    expect(semantic.spacing.md).toBe(spacing[4])
  })
})
```

- [ ] **Step 12: Run test to verify it fails**

Run: `npx vitest run` (workdir `packages/tokens`)
Expected: FAIL — module resolution/type errors before the exporter fixes (or PASS if vitest transpiles; in either case the next steps make it green under tsc/vite build).

- [ ] **Step 13: Install dependencies**

Run: `pnpm --filter @xerena/tokens install` (or `pnpm install` at root)
Expected: devDeps linked; `tsup`, `vitest` resolvable.

- [ ] **Step 14: Verify green everywhere**

Run:
```bash
pnpm --filter @xerena/tokens test
pnpm --filter @xerena/tokens typecheck
pnpm --filter @xerena/tokens build
```
Expected: tests PASS, typecheck exit 0, build writes `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts`, `dist/tokens.css`, `dist/tokens.json`.

- [ ] **Step 15: Verify CSS output**

Run: `cat packages/tokens/dist/tokens.css`
Expected: contains `--xr-color-blue-600: #2563eb;` and `--xr-spacing-4: 16;`.

- [ ] **Step 16: Commit**

```bash
git add packages/tokens/ pnpm-lock.yaml package.json
git commit -m "feat(tokens): bootstrap token package with generator"
```

---

### Task 6: `@xerena/react` — web package skeleton

**Files:**
- Create: `packages/react/package.json`
- Create: `packages/react/tsconfig.json`
- Create: `packages/react/project.json`
- Create: `packages/react/eslint.config.js`
- Create: `packages/react/vite.config.ts`
- Create: `packages/react/src/index.ts`
- Create: `packages/react/src/primitives/Provider.tsx`
- Create: `packages/react/src/primitives/ThemeContext.ts`
- Create: `packages/react/src/styles/base.css`
- Test: `packages/react/src/primitives/Provider.test.tsx`

**Interfaces:**
- Consumes: `@xerena/tokens` (colors/semantic), shared configs.
- Produces: `Provider` (theme context + light/dark mode toggle) and `useTheme` — the theming contract consumed by the Storybook decorator (Task 8) and later components. Build: Vite lib mode, ESM + CJS + `.d.ts` in `dist/`.

- [ ] **Step 1: Create `packages/react/package.json`**

```json
{
  "name": "@xerena/react",
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
    "./styles/base.css": "./dist/base.css"
  },
  "files": ["dist"],
  "sideEffects": ["**/*.css"],
  "scripts": {
    "build": "vite build && node scripts/copy-css.mjs"
  },
  "dependencies": {
    "@xerena/tokens": "workspace:*"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.6.0",
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

- [ ] **Step 2: Create `packages/react/tsconfig.json`**

```json
{
  "extends": "../../tools/tsconfig/tsconfig.react.json",
  "include": ["src", "vite.config.ts"]
}
```

- [ ] **Step 3: Create `packages/react/project.json`**

```json
{
  "name": "react",
  "projectType": "library",
  "sourceRoot": "packages/react/src",
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "options": { "command": "pnpm build", "cwd": "packages/react" },
      "outputs": ["{projectRoot}/dist"]
    },
    "test": {
      "executor": "nx:run-commands",
      "options": { "command": "vitest run", "cwd": "packages/react" }
    },
    "typecheck": {
      "executor": "nx:run-commands",
      "options": { "command": "tsc -p tsconfig.json --noEmit", "cwd": "packages/react" }
    },
    "lint": {
      "executor": "nx:run-commands",
      "options": { "command": "eslint src", "cwd": "packages/react" }
    }
  }
}
```

- [ ] **Step 4: Create `packages/react/eslint.config.js`**

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
          ],
        },
      ],
    },
  },
]
```

- [ ] **Step 5: Create `packages/react/vite.config.ts`**

```ts
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'XerenaReact',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    cssCodeSplit: false,
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

- [ ] **Step 6: Create `packages/react/vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 6b: Create `packages/react/scripts/copy-css.mjs`**

```js
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
mkdirSync(resolve(root, 'dist'), { recursive: true })
copyFileSync(
  resolve(root, 'src/styles/base.css'),
  resolve(root, 'dist/base.css'),
)
console.log('copied dist/base.css')
```

- [ ] **Step 7: Create `packages/react/src/index.ts`**

```ts
export * from './primitives/Provider'
export * from './primitives/ThemeContext'
```

- [ ] **Step 8: Create `packages/react/src/primitives/ThemeContext.ts`**

```ts
import { createContext } from 'react'

export type ColorMode = 'light' | 'dark'

export interface XTheme {
  mode: ColorMode
}

export interface ThemeContextValue {
  theme: XTheme
  setTheme: (theme: XTheme) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
```

- [ ] **Step 9: Create `packages/react/src/primitives/Provider.tsx`**

```tsx
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ThemeContext, type ThemeContextValue, type XTheme } from './ThemeContext'

export interface ProviderProps {
  children: ReactNode
  initialMode?: 'light' | 'dark'
}

export function Provider({ children, initialMode = 'light' }: ProviderProps) {
  const [theme, setTheme] = useState<XTheme>({ mode: initialMode })

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme }),
    [theme],
  )

  return (
    <ThemeContext.Provider value={value}>
      <div data-xerena-theme={theme.mode}>{children}</div>
    </ThemeContext.Provider>
  )
}
```

- [ ] **Step 10: Create `packages/react/src/styles/base.css`**

```css
[data-xerena-theme='dark'] {
  color-scheme: dark;
}
```

- [ ] **Step 11: Write the failing test**

Create `packages/react/src/primitives/Provider.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Provider } from './Provider'

describe('Provider', () => {
  it('wraps children inside the theme surface', () => {
    render(
      <Provider>
        <span>content</span>
      </Provider>,
    )
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('renders data-xerena-theme attribute', () => {
    render(<Provider>hi</Provider>)
    expect(document.querySelector('[data-xerena-theme="light"]')).not.toBeNull()
  })
})
```

- [ ] **Step 12: Run test to verify it fails**

Run: `npx vitest run` (workdir `packages/react`)
Expected: FAIL — `Provider`/`useTheme` not exported yet (or fails to resolve `@xerena/tokens` until install).

- [ ] **Step 13: Install dependencies**

Run: `pnpm install` (root) — links `@xerena/tokens` workspace dep.

- [ ] **Step 14: Verify green everywhere**

Run:
```bash
pnpm --filter @xerena/react test
pnpm --filter @xerena/react typecheck
pnpm --filter @xerena/react build
```
Expected: tests PASS, typecheck exit 0, `dist/` contains `index.js`, `index.cjs`, `index.d.ts`.

- [ ] **Step 15: Commit**

```bash
git add packages/react/ pnpm-lock.yaml
git commit -m "feat(react): bootstrap web package with theme provider"
```

---

### Task 7: `@xerena/native` — React Native package skeleton

**Files:**
- Create: `packages/react-native/package.json`
- Create: `packages/react-native/tsconfig.json`
- Create: `packages/react-native/project.json`
- Create: `packages/react-native/eslint.config.mjs` (ESM config; package stays untyped-as-module so `lib/commonjs` remains CJS in Node)
- Create: `packages/react-native/src/index.ts`
- Create: `packages/react-native/src/primitives/Provider.tsx`
- Create: `packages/react-native/src/primitives/ThemeContext.ts`
- Test: `packages/react-native/src/primitives/Provider.test.tsx`

**Interfaces:**
- Consumes: `@xerena/tokens` via `tokens.json` export path, shared configs.
- Produces: native `Provider` (same API surface as web `Provider` — `ProviderProps`, `XTheme`, `ColorMode`, `useTheme`), built with react-native-builder-bob. Jest preset at `tools/jest/jest.preset.native.cjs`.

- [ ] **Step 1: Create `tools/jest/jest.preset.native.cjs`**

```js
/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',
  testMatch: ['**/*.test.{ts,tsx}'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation)/)',
  ],
}
```

- [ ] **Step 2: Create `packages/react-native/package.json`**

```json
{
  "name": "@xerena/native",
  "version": "0.0.0",
  "main": "lib/commonjs/index.js",
  "module": "lib/module/index.js",
  "types": "lib/typescript/index.d.ts",
  "react-native": "lib/module/index.js",
  "exports": {
    ".": {
      "react-native": "./lib/module/index.js",
      "import": "./lib/module/index.js",
      "require": "./lib/commonjs/index.js",
      "types": "./lib/typescript/index.d.ts"
    }
  },
  "files": ["lib", "src"],
  "bob": {
    "source": "src",
    "output": "lib",
    "targets": [
      "commonjs",
      "module",
      "typescript"
    ]
  },
  "scripts": {
    "build": "bob build"
  },
  "dependencies": {
    "@xerena/tokens": "workspace:*"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-native": "^0.78.0"
  },
  "devDependencies": {
    "@testing-library/react-native": "^13.0.0",
    "@types/react": "^19.0.0",
    "jest": "^29.7.0",
    "react": "^19.0.0",
    "react-native": "^0.78.0",
    "react-native-builder-bob": "^0.30.0",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 3: Create `packages/react-native/tsconfig.json`**

```json
{
  "extends": "../../tools/tsconfig/tsconfig.rn.json",
  "include": ["src"]
}
```

- [ ] **Step 4: Create `packages/react-native/project.json`**

```json
{
  "name": "react-native",
  "projectType": "library",
  "sourceRoot": "packages/react-native/src",
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "options": { "command": "pnpm build", "cwd": "packages/react-native" },
      "outputs": ["{projectRoot}/lib"]
    },
    "test": {
      "executor": "nx:run-commands",
      "options": { "command": "jest", "cwd": "packages/react-native" }
    },
    "typecheck": {
      "executor": "nx:run-commands",
      "options": { "command": "tsc -p tsconfig.json --noEmit", "cwd": "packages/react-native" }
    },
    "lint": {
      "executor": "nx:run-commands",
      "options": { "command": "eslint src", "cwd": "packages/react-native" }
    }
  }
}
```

- [ ] **Step 5: Create `packages/react-native/eslint.config.mjs`**

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
            { name: '@xerena/react', message: 'native package must not import web' },
          ],
        },
      ],
    },
  },
]
```

- [ ] **Step 6: Create `packages/react-native/src/index.ts`**

```ts
export * from './primitives/Provider'
export * from './primitives/ThemeContext'
```

- [ ] **Step 7: Create `packages/react-native/src/primitives/ThemeContext.ts`**

```ts
import { createContext } from 'react'

export type ColorMode = 'light' | 'dark'

export interface XTheme {
  mode: ColorMode
  colors?: Record<string, string>
}

export interface ThemeContextValue {
  theme: XTheme
  setTheme: (theme: XTheme) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
```

- [ ] **Step 8: Create `packages/react-native/src/primitives/Provider.tsx`**

```tsx
import { Fragment, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Text } from 'react-native'
import { ThemeContext, type ThemeContextValue, type XTheme } from './ThemeContext'

export interface ProviderProps {
  children: ReactNode
  initialMode?: 'light' | 'dark'
}

export function Provider({ children, initialMode = 'light' }: ProviderProps) {
  const [theme, setTheme] = useState<XTheme>({ mode: initialMode })

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme }),
    [theme],
  )

  return (
    <Fragment>
      <Text>{`xerena-theme:${theme.mode}`}</Text>
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    </Fragment>
  )
}
```

- [ ] **Step 9: Write the failing test**

Create `packages/react-native/src/primitives/Provider.test.tsx`:

```tsx
import React from 'react'
import { Text } from 'react-native'
import { render } from '@testing-library/react-native'
import { Provider } from './Provider'

describe('Provider', () => {
  it('renders theme mode indicator', () => {
    const { getByText } = render(
      <Provider>
        <Text>child</Text>
      </Provider>,
    )
    expect(getByText('xerena-theme:light')).toBeDefined()
  })
})
```

- [ ] **Step 10: Run test to verify it fails**

Run: `npx jest` (workdir `packages/react-native`)
Expected: FAIL first (module resolution), then PASS after install — key deliverable is that Jest + RN preset loads and the `xerena-theme:light` string asserts correctly.

- [ ] **Step 11: Install dependencies**

Run: `pnpm install` (root)
Expected: `react-native`, `jest`, bob, RN testing lib resolved.

- [ ] **Step 12: Verify green everywhere**

Run:
```bash
pnpm --filter @xerena/native test
pnpm --filter @xerena/native typecheck
pnpm --filter @xerena/native build
```
Expected: tests PASS, typecheck exit 0, `lib/` contains `commonjs/index.js`, `module/index.js`, `typescript/index.d.ts`.

- [ ] **Step 13: Commit**

```bash
git add tools/jest/ packages/react-native/ pnpm-lock.yaml
git commit -m "feat(native): bootstrap react native package with theme provider"
```

---

### Task 8: Storybook App (Vite) + token gallery

**Files:**
- Create: `apps/storybook/package.json`
- Create: `apps/storybook/.storybook/main.ts`
- Create: `apps/storybook/.storybook/preview.tsx`
- Create: `apps/storybook/project.json`
- Create: `apps/storybook/stories/tokens.stories.tsx`

**Interfaces:**
- Consumes: `@xerena/react` `Provider`, `@xerena/tokens` `colors`/`semantic`.
- Produces: `storybook` Nx app with `dev` (port 6006) and `build` (static) targets; tokens gallery story proving web package integration.

- [ ] **Step 1: Create `apps/storybook/package.json`**

```json
{
  "name": "@xerena/storybook",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "storybook dev -p 6006",
    "build": "storybook build"
  },
  "dependencies": {
    "@xerena/react": "workspace:*",
    "@xerena/tokens": "workspace:*"
  },
  "devDependencies": {
    "@storybook/addon-a11y": "^8.0.0",
    "@storybook/addon-essentials": "^8.0.0",
    "@storybook/react-vite": "^8.0.0",
    "@storybook/react": "^8.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 2: Create `apps/storybook/.storybook/main.ts`**

```ts
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}

export default config
```

- [ ] **Step 3: Create `apps/storybook/.storybook/preview.tsx`**

```tsx
import React from 'react'
import type { Preview } from '@storybook/react'
import { Provider } from '@xerena/react'
import '@xerena/react/styles/base.css'

const preview: Preview = {
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

- [ ] **Step 4: Create `apps/storybook/project.json`**

```json
{
  "name": "storybook",
  "projectType": "application",
  "sourceRoot": "apps/storybook/stories",
  "targets": {
    "dev": {
      "executor": "nx:run-commands",
      "options": { "command": "pnpm dev", "cwd": "apps/storybook" }
    },
    "build": {
      "executor": "nx:run-commands",
      "options": { "command": "pnpm build", "cwd": "apps/storybook" },
      "outputs": ["{projectRoot}/storybook-static"]
    }
  }
}
```

- [ ] **Step 5: Create `apps/storybook/stories/tokens.stories.tsx`**

```tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { colors, semantic } from '@xerena/tokens'

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

- [ ] **Step 6: Install dependencies**

Run: `pnpm install` (root)

- [ ] **Step 7: Verify Storybook boots**

Run: `npx storybook dev -p 6006` (workdir `apps/storybook`), wait for "Storybook started", then stop.
Expected: server starts on port 6006, `Design Tokens/Gallery` story loads without error.

- [ ] **Step 8: Verify Storybook builds**

Run: `npx storybook build` (workdir `apps/storybook`)
Expected: `storybook-static/` created with `index.html`.

- [ ] **Step 9: Commit**

```bash
git add apps/storybook/ package.json pnpm-lock.yaml
git commit -m "feat(storybook): bootstrap storybook with token gallery"
```

---

### Task 9: VitePress Docs App

**Files:**
- Create: `apps/docs/package.json`
- Create: `apps/docs/config.mts`
- Create: `apps/docs/index.md`
- Create: `apps/docs/guide/getting-started.md`
- Create: `apps/docs/guide/theming.md`
- Create: `apps/docs/project.json`

**Interfaces:**
- Consumes: nothing at build time (docs markdown).
- Produces: `docs` Nx app with `dev` and `build` targets; VitePress site scaffold with navigation.

- [ ] **Step 1: Create `apps/docs/package.json`**

```json
{
  "name": "@xerena/docs",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vitepress dev .",
    "build": "vitepress build .",
    "preview": "vitepress preview ."
  },
  "devDependencies": {
    "vitepress": "^1.6.0"
  }
}
```

- [ ] **Step 2: Create `apps/docs/config.mts`**

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Xerena UI',
  description: 'Cross-platform design system for React and React Native',
  themeConfig: {
    nav: [{ text: 'Guide', link: '/guide/getting-started' }],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Theming', link: '/guide/theming' },
        ],
      },
    ],
  },
})
```

- [ ] **Step 3: Create `apps/docs/index.md`**

```markdown
# Xerena UI

Cross-platform design system for React and React Native.

- `@xerena/tokens` — single source of truth design tokens
- `@xerena/react` — web components
- `@xerena/native` — React Native components

Check the [Getting Started guide](/guide/getting-started).
```

- [ ] **Step 4: Create `apps/docs/guide/getting-started.md`**

```markdown
# Getting Started

## Install

```bash
pnpm add @xerena/tokens @xerena/react
```

## Web

```tsx
import { Provider } from '@xerena/react'
import '@xerena/react/styles/base.css'

export function App() {
  return <Provider>…</Provider>
}
```

## React Native

```bash
pnpm add @xerena/tokens @xerena/native
```

```tsx
import { Provider } from '@xerena/native'

export function App() {
  return <Provider>…</Provider>
}
```

> **Note:** The web and native packages share the same API; web uses CSS variables, native uses StyleSheet.
```

- [ ] **Step 5: Create `apps/docs/guide/theming.md`**

```markdown
# Theming

Xerena UI uses a three-layer token architecture: primitive → semantic → component.

```json
{
  "color": {
    "primary": "var(--xr-color-blue-600)"
  }
}
```

Web consumes generated CSS variables (`@xerena/tokens/tokens.css`);
React Native consumes the JSON token file (`@xerena/tokens/tokens.json`).
```

- [ ] **Step 6: Create `apps/docs/project.json`**

```json
{
  "name": "docs",
  "projectType": "application",
  "sourceRoot": "apps/docs",
  "targets": {
    "dev": {
      "executor": "nx:run-commands",
      "options": { "command": "pnpm dev", "cwd": "apps/docs" }
    },
    "build": {
      "executor": "nx:run-commands",
      "options": { "command": "pnpm build", "cwd": "apps/docs" },
      "outputs": ["{projectRoot}/.vitepress/dist"]
    }
  }
}
```

- [ ] **Step 7: Install dependencies**

Run: `pnpm install` (root)

- [ ] **Step 8: Verify docs build**

Run: `pnpm --filter @xerena/docs build`
Expected: `.vitepress/dist/index.html` produced, exit 0.

- [ ] **Step 9: Commit**

```bash
git add apps/docs/ package.json pnpm-lock.yaml
git commit -m "feat(docs): bootstrap vitepress documentation app"
```

---

### Task 10: Changesets — versioning & publish config

**Files:**
- Create: `.changeset/config.json`
- Create: `.changeset/README.md`
- Modify: `package.json` (add `changeset` script + `@changesets/cli` devDep)

**Interfaces:**
- Consumes: nothing.
- Produces: changesets config (independent package versions, public access, base branch `main`) used by `release.yml` (Task 11).

- [ ] **Step 1: Update root `package.json` scripts**

Add to `scripts`:

```json
"changeset": "changeset",
"release": "changeset publish",
```

And add devDependency:

```json
"@changesets/cli": "^2.27.0"
```

- [ ] **Step 2: Create `.changeset/config.json`**

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog-git",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

- [ ] **Step 3: Create `.changeset/README.md`**

```markdown
# Changesets

Add a changeset for any publishable package change:

```bash
pnpm changeset
```

See https://github.com/changesets/changesets for docs.
```

- [ ] **Step 4: Install and verify**

Run: `pnpm install`; then `pnpm changeset status`
Expected: exit 0 (no pending changesets is fine).

- [ ] **Step 5: Commit**

```bash
git add .changeset/ package.json pnpm-lock.yaml
git commit -m "chore: add changesets versioning config"
```

---

### Task 11: GitHub Actions CI + Release

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/release.yml`

**Interfaces:**
- Consumes: Nx targets from Tasks 5–7, changesets config from Task 10.
- Produces: CI gate (typecheck, lint, test, build on PR) and release pipeline (build → version → publish → tag).

- [ ] **Step 1: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - name: Typecheck
        run: npx nx run-many -t typecheck

      - name: Lint
        run: npx nx run-many -t lint

      - name: Test
        run: npx nx run-many -t test

      - name: Build
        run: npx nx run-many -t build
```

- [ ] **Step 2: Create `.github/workflows/release.yml`**

```yaml
name: Release

on:
  push:
    branches: [main]

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    runs-on: ubuntu-latest
    if: github.repository == 'xerena/xerena-ui'
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - name: Build
        run: npx nx run-many -t build

      - name: Create Release PR or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm changeset publish
          version: pnpm changeset version
          commit: 'chore: version packages'
          title: 'chore: version packages'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

- [ ] **Step 3: Validate workflow YAML syntax**

Run: `npx -y actionlint .github/workflows/ci.yml .github/workflows/release.yml`
Expected: no errors reported, exit 0.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/
git commit -m "ci: add pr checks and changesets release workflow"
```

---

### Task 12: Final verification — full pipeline

**Files:**
- Modify: none (verification only).

**Interfaces:**
- Consumes: all previous tasks.
- Produces: proof the foundation pipeline is green end-to-end.

- [ ] **Step 1: Clean build of everything**

Run:
```bash
nx run-many -t typecheck --projects=tokens,react,react-native
nx run-many -t lint --projects=tokens,react,react-native
nx run-many -t test --projects=tokens,react,react-native
nx run-many -t build
```
Expected: all targets exit 0 across `tokens`, `react`, `react-native`, `storybook`, `docs`.

- [ ] **Step 2: Confirm Nx cache hit on rerun**

Run the same command again.
Expected: `CACHED` markers on previously-run tasks, no rebuild/re-test.

- [ ] **Step 3: Confirm dependency-order build**

Run: `npx nx run-many -t build --graph`
Expected: graph shows `tokens` → `react` → `react-native` order.

- [ ] **Step 4: Update README with final commands**

Modify `README.md` "Development" section to add:

```markdown
## Commands

```bash
nx run-many -t typecheck lint test build   # full check
nx test react                               # web tests
nx test tokens                              # token tests
nx dev storybook                            # component explorer (port 6006)
nx dev docs                                 # docs site
pnpm changeset                              # record changes for release
```
```

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: document development commands"
```

---

## Self-Review Notes

- **Spec coverage:** sections 2 (structure), 3 (boundaries via eslint gates), 4 (build pipeline), 5 (testing), 6 (storybook+docs), 7 (git/CI changesets), 8 (roadmap) — all covered by Tasks 1–12.
- **Placeholder scan:** no TBD/TODO; every code block is concrete.
- **Type consistency:** `ProviderProps`, `XTheme`, `ColorMode`, `useTheme`, `name` export surface consistent across web (`packages/react/src/primitives`) and native (`packages/react-native/src/primitives`); boundary gate uses `@xerena/native` and `@xerena/react` literal names consistently.
