# Xerena UI — Repository, Workflow & Tooling Design

- **Date:** 2026-09-11
- **Type:** Architecture (greenfield, repo foundation only — no component implementation yet)
- **Status:** Approved by user (all design sections validated)

## 1. Overview

Xerena UI adalah design system library untuk React (web) dan React Native,
dibangun sebagai Nx monorepo dengan pnpm. Software dibagi menjadi tiga package
yang dipublish (`@xerena/tokens`, `@xerena/react`, `@xerena/native`), plus
aplikasi pendukung (Storybook, VitePress docs, contoh Expo) dan shared tooling.

Fondasi ini mencakup: struktur repo, dependency graph & boundary, build
pipeline, strategi testing, dokumentasi, workflow Git, dan CI/CD release.
Implementasi komponen dilakukan pada milestone terpisah.

## 2. Repo Structure

```
xerena-ui/
├── apps/
│   ├── storybook/                # @xerena/storybook — Storybook 8 (Vite)
│   ├── docs/                     # @xerena/docs — VitePress docs site
│   └── example-rn/               # Expo app untuk testing komponen RN
│
├── packages/
│   ├── tokens/                   # @xerena/tokens — design tokens
│   │   └── src/
│   │       ├── colors.ts         # Primitive color scale
│   │       ├── spacing.ts        # Primitive spacing scale
│   │       ├── typography.ts     # Font families, sizes, weights
│   │       ├── radius.ts         # Border radius
│   │       ├── motion.ts         # Durasi, easing
│   │       ├── semantic/         # Purpose aliases (primary, background, ...)
│   │       ├── components/       # Component-level tokens
│   │       ├── scripts/          # Generator: tokens.css & tokens.ts
│   │       └── index.ts
│   │
│   ├── react/                    # @xerena/react — web components
│   │   └── src/
│   │       ├── components/       # Button/, Input/, ... (co-located tests)
│   │       ├── primitives/       # Provider, useTheme
│   │       ├── styles/base.css   # CSS variables dari tokens
│   │       └── index.ts
│   │
│   └── react-native/             # @xerena/native — RN components
│       └── src/
│           ├── components/       # Button/, Input/, ... (co-located tests)
│           ├── primitives/       # Provider, useTheme
│           ├── styles/tokens.ts  # Helper: token → StyleSheet value
│           └── index.ts
│
├── tools/
│   ├── eslint-config/            # @xerena/eslint — shared rules + boundary lint
│   ├── tsconfig/                 # base / react / rn tsconfigs
│   └── jest/jest.preset.native.cjs
│
├── .github/workflows/
│   ├── ci.yml                    # typecheck + lint + test + build (PR)
│   └── release.yml               # Changesets publish (main)
│
├── nx.json                       # Task pipeline + caching
├── package.json                  # Root pnpm workspace
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── vitest.workspace.ts
├── .changeset/config.json
├── .npmrc                        # shamefully-hoist=true (RN compat)
└── README.md
```

Prinsip:
- `apps/` hanya konsumen; `packages/` semua source/library; `tools/` shared tooling (tidak dipublish).
- `apps/example-rn/` hanya untuk dev-testing, bukan bagian dari library.
- Tokens punya dua entry export: CSS variables (web) dan object (RN).

## 3. Dependency Graph & Boundaries

```
@xerena/tokens  ←── @xerena/react  ←── (tidak mengimpor native)
                ←── @xerena/native ←── (tidak mengimpor react)
                (apps boleh mengimpor semua)
```

Aturan (ditegakkan via ESLint `no-restricted-imports` dan Nx dependency
constraints):
- `tokens`: zero-dependency (pure TypeScript).
- `react`: hanya `tokens`, `react`, `react-dom`. Type-only dari `native` untuk alignment API.
- `native`: hanya `tokens`, `react-native`, `react`. Type-only dari `react` jika dibutuhkan.
- **Tanpa runtime cross-import** antara `react` ↔ `native`. API selaras karena dibangun dari `tokens` yang sama + kontrak types (type-only).
- Alasan: web (CSS) dan native (StyleSheet) punya style system berbeda; berbagi API surface, bukan code.

## 4. Build Pipeline

| Package | Build Tool | Output |
|---------|-----------|--------|
| `@xerena/tokens` | tsup | ESM + CJS + `.d.ts` |
| `@xerena/react` | Vite library mode (Rolldown) | ESM + CJS + `.d.ts` + CSS vars |
| `@xerena/native` | react-native-builder-bob | CJS + ESM + `.d.ts` (per platform entry) |

Nx pipeline di `nx.json` memastikan urutan build yang benar dan caching.

`@xerena/tokens` punya script generator build-time dengan satu source of truth
dalam JSON/TS yang menghasilkan:
- `tokens.css` (CSS variables — untuk `@xerena/react`)
- `tokens.ts` (object — untuk `@xerena/native`)

Web dan native tidak pernah punya nilai yang berbeda.

## 5. Testing Strategy

| Layer | Framework | Target |
|-------|-----------|--------|
| Unit web | Vitest + React Testing Library + jsdom | `packages/react/**/*.test.tsx` |
| Unit native | Jest + `@testing-library/react-native` | `packages/native/**/*.test.tsx` |
| Tokens | Vitest | generator output & scale math |
| Visual/interaction | Storybook Playwright test-runner (fase lanjut) | komponen web |
| Type | `tsc --noEmit` | semua package |

- Test colocated: `*.test.tsx` di folder komponen.
- Cakupan minimal per komponen publish: render default, variants, states (hover/active/disabled), theming override, aksesibilitas (roles/aria).
- Boundary lint via `no-restricted-imports`.

Command: `nx test react`, `nx test native --watch`, `nx test tokens`,
`nx run-many -t test`, `nx run-many -t typecheck lint`.

## 6. Dokumentasi — Storybook + VitePress

- **Storybook** (`apps/storybook`): component explorer untuk developer. Interaksi nyata, props live-editing, light/dark toggle, a11y addon aktif.
- **VitePress** (`apps/docs`): panduan konsumen — getting started, instalasi, theming, token reference, prop tables, best practice, migration notes.
- Walk-through per komponen (shippable gate): tokens → implementasi → test → stories → docs page.
- Satu provider yang sama di Storybook & docs memakai `@xerena/tokens` agar sinkron visual.

## 7. Workflow Git & CI/CD

### Branching
- `main` protected; semua pekerjaan lewat PR (`feature/*`, `fix/*`, `chore/*`, `docs/*`).
- Conventional Commits; squash merge (linear history).

### CI (`ci.yml`) — trigger: PR & push main
`pnpm install --frozen-lockfile` → `nx run-many -t typecheck lint test build`
(optimasi `nx affected`). Nx + pnpm store caching.

### Release (`release.yml`) — trigger: merge ke main
`build` → `changeset version` → `pnpm install` → `changeset publish` (NPM_TOKEN) → GitHub Release dari changelog.

### Versioning
- `.changeset/*.md` wajib untuk PR yang mengubah behavior (diblokir CI via `changesets/action`).
- Versi per-package (independent), tag `@xerena/*@x.y.z`.
- Env: Node 22 LTS, pnpm 10, `NPM_TOKEN` repository secret.

### Quality gate merge
1. typecheck + lint + test + build hijau
2. changeset tersedia (jika behavior berubah)
3. Storybook stories untuk komponen baru
4. Docs page untuk API publik yang berubah
5. Minimal 1 approver

## 8. Roadmap berikutnya (di luar fondasi ini)

1. Scaffold repo (nx.json, workspaces, tools, CI skeleton) — implementation plan pertama.
2. Paket `@xerena/tokens` + generator.
3. Paket `@xerena/react` + Storybook.
4. Paket `@xerena/native` + expo example.
5. Rilis pertama via Changesets.
```