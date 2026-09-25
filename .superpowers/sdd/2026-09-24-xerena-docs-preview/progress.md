# Progress ledger — 2026-09-24 Xerena docs preview

## Task 1: Stack verification spike — PASS (2026-09-25)

Scratch app: `/tmp/opencode/docs-spike` (throwaway, deleted after verification).
Scaffold copied the Task 4 file shapes; build asserted; hook-without-client probe run.

### Locked versions (from scratch pnpm-lock.yaml)

- next 16.3.6
- react 19.3.0, react-dom 19.3.0
- fumadocs-core 16.15.14
- fumadocs-ui 16.15.14
- fumadocs-mdx 15.4.4
- tailwindcss 4.3.3, @tailwindcss/postcss 4.3.3 (resolved from ^4)
- typescript 5.9.3 (resolved from ^5.6.0), @types/react 19.3.0, @types/react-dom 19.3.0, @types/mdx 2.0.14
- Next auto-added @types/node 26.6.2 as a devDependency on first build (Task 4 must expect this lockfile addition or pin @types/node explicitly).
- Scratch ran under pnpm 12.6.0 (corepack default outside the repo); the repo toolchain stays pnpm@10.0.0.

### Confirmed config keys (all present in the installed versions)

- `source.config.ts`: `defineConfig` and `defineDocs` are both exported from `fumadocs-mdx/config`. `mdxOptions.remarkPlugins` accepted the no-op plugin and MDX compiled cleanly.
- `lib/source.ts`: `loader` from `fumadocs-core/source` plus `docs.toFumadocsSource()` works.
- `app/api/search/route.ts`: `createFromSource` from `fumadocs-core/search/server` returns `{ GET, staticGET }`; `export const { staticGET: GET } = createFromSource(source)` works.
- `mdx-components.tsx`: default export `defaultMdxComponents` from `fumadocs-ui/mdx` works.
- Docs page: `DocsPage`, `DocsBody`, `DocsDescription`, `DocsTitle` from `fumadocs-ui/layouts/docs/page`, plus `generateStaticParams` via `source.generateParams()`, all work.
- `RootProvider` accepts `search={{ options: { type: 'static' } }}`. Note: `type: 'static'` on `DefaultSearchDialogProps` is marked `@deprecated` but is present and functional.

### Deviations Task 4 MUST apply (verbatim plan shape fails without them)

1. `app/layout.tsx`: the import path `fumadocs-ui/root-provider` DOES NOT EXIST in fumadocs-ui 16.15.14 (no such package export). Task 4 must use `import { RootProvider } from 'fumadocs-ui/provider/next'`.
2. NEW FILE `app/docs/layout.tsx` is required: `DocsPage` must render under `DocsLayout` from `fumadocs-ui/layouts/docs` (`<DocsLayout tree={source.pageTree}>`). Without it, prerendering `/docs` fails with `Please use <DocsPage /> under <DocsLayout />`. `source.pageTree` is the tree root directly (no i18n).
3. The `Preview` key in `mdx-components.tsx` could not be exercised in the spike (`@xerena/preview` is not built yet); only the insertion shape is confirmed. Task 4 wires the real import.

### Static export assertions (all PASS)

- `pnpm exec next build` exits 0 with `output: 'export'`, `basePath: '/xerena-ui'`, `trailingSlash: true`.
- `out/index.html` exists.
- The static search payload is emitted at `out/api/search` (recorded verbatim: an extensionless file containing the JSON search index). Task 4 must assert exactly this path, not any `*search*.json` name.
- The client component marker `SPIKE_CLIENT_MARKER:0` appears in the built `out/docs/index.html`.

### Hook-without-'use client' probe (fails the build, as expected)

Rendering a `useState` component WITHOUT `'use client'` from MDX fails the build with exit 1:

```text
Error: You're importing a module that depends on `useState` into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the `"use client"` directive.
```

The Task 5 authoring rule stands: every interactive example lives in a `'use client'` file; MDX pages stay server components.

### Notes for later tasks

- The search index emitted by fumadocs-core 16.15.14 is zbsearch-based (payload opens with `{"type":"advanced",...}`), not Orama. The plan's "Orama search in static mode" architecture line is stale; the static wiring (`staticGET` plus `type: 'static'`) is unaffected.
- Next 16 rewrites `tsconfig.json` on first build (`jsx` forced to `react-jsx`, plus `lib`, `allowJs`, `noEmit`, `incremental`). Committing the Task 4 tsconfig with `jsx: preserve` is fine; Next adjusts it automatically.
- pnpm 12 in scratch required `allowBuilds: { esbuild: true }` in `pnpm-workspace.yaml` before installs exited 0 ( scratch-only plumbing, deleted with the scratch dir).

### Verdict: PASS — proceed to Task 2.

## Task 2: packages/preview scaffold + Preview component — BLOCKED (2026-09-25)

Steps 1–7 executed verbatim (all 12 Task 2 files written exactly as specified in the plan).
Steps 8–9 gates are red for reasons outside `packages/preview`. Steps 10–11 withheld (see below).
TDD RED verified in Step 4: `vitest run src/Preview.test.tsx` failed with
`Failed to resolve import "./Preview"` (not command-not-found; plain `pnpm install` run first).
All `--xr-*` variables used in `styles.css` verified present in `packages/tokens/dist/tokens.css`.

### Gate tails (all with --skip-nx-cache)

- `preview:test`: 5 passed / 2 failed of 7. Failures: `theme toggle is local to the preview`
  and `works identically under prefers-reduced-motion` — both assert a mode change AFTER mount.
- `preview:typecheck`: PASS.
- `preview:lint`: PASS.
- `preview:build`: FAIL — `Could not resolve entry module "src/mdx.ts"`. No `dist/` emitted.

### Blocker A: @xerena/react Provider drops theme prop updates after mount

`packages/react/src/primitives/Provider.tsx:15-16`:

```tsx
const [stored, setStored] = useState<XTheme>(theme)
const activeTheme = theme.mode === stored.mode ? { ...stored, ...theme } : stored
```

When a parent switches `theme.mode` (light to dark), `stored` is never resynced and the guard
selects the stale `stored` theme, so `<div data-xerena-theme={...}>` never flips. The plan's
`Preview.tsx` drives `Provider` in controlled mode (`theme={previewTheme(mode)}`), which this
`Provider` does not support. Isolated repro (render light, rerender dark, temporary test file
since removed) fails against the freshly built `@xerena/react` dist, whose minified output
contains the same logic (`E.mode === S.mode ? {...S, ...E} : S`). Existing `Provider.test.tsx`
only covers initial mount, which is why this went unnoticed. The `stored` logic dates to
`0b5b77c` (pre-plan), so the plan's assumption was incorrect from the start, not a regression.
Fixing `Provider` is out of Task 2 scope (separate package, published `0.1.0`, needs its own
test + review) — not attempted here.

### Blocker B: vite mdx entry points at a Task 3 file

The verbatim `vite.config.ts` declares lib entry `mdx: src/mdx.ts`, but `src/mdx.ts` is only
created in Task 3. Task 2's Step 9 build therefore cannot succeed as written. Not worked around
(stubbing `mdx.ts` would bleed Task 3 scope; editing the config would violate verbatim rule).

### Withheld steps and why

- Step 10 (root `package.json` scripts gain `preview`): NOT executed. Registering a red project
  would break repo-wide `pnpm test` / `pnpm lint` / `pnpm typecheck` on this branch.
- Step 11 (feat commit): NOT executed. Gates are red; the planned message would misrepresent.
  This ledger entry is committed alone (Task 1 precedent). `packages/preview/` files plus the
  `pnpm-lock.yaml` workspace-link update remain uncommitted in the working tree for inspection.

### Proposed paths (require plan amendment, not executed)

1. Fix `Provider` to follow controlled `theme` prop updates (own test in `packages/react`,
   own commit), then re-run Task 2 Step 8.
2. Alternatively amend the plan if uncontrolled-with-remount semantics are intended.
3. For Blocker B: either move the dual-entry `vite.config.ts` to Task 3 or accept a Task 3
   dependency for the Task 2 build gate.

## Task 2 resumed under amended plan — STILL BLOCKED (2026-09-25)

Amendment `f82438a` applied as instructed, tests left unmodified:

- `src/Preview.tsx`: added the `ModeSync` inner component verbatim (drives the switch through
  the context `setTheme` API); nothing else changed.
- `vite.config.ts`: removed the `mdx` entry (single `index` entry; `fileName` kept as-is).
- `@xerena/react` untouched. `src/Preview.test.tsx` untouched (7 tests as before).

### Gate tails (all with --skip-nx-cache)

- `preview:test`: HANG — zero tests complete. Direct run
  `timeout -s KILL 60 pnpm exec vitest run src/Preview.test.tsx --reporter=verbose`
  exits 124 (killed) with only the `RUN` banner; no test finishes, including test 1 which
  needs no interaction. Under `nx run-many`, the vitest worker instead dies with
  `FatalProcessOutOfMemory` (`tinypool` channel closed, `ERR_IPC_CHANNEL_CLOSED`).
- `preview:typecheck`: PASS. `preview:lint`: PASS (both with the amended code).
- `preview:build`, Step 10, Step 11: NOT executed (test gate red; same withholding rationale
  as before — no root script registration, no feat commit).

### Root cause: amended ModeSync creates an infinite render loop

Traced from `packages/react/src/primitives/Provider.tsx` (read, not guessed):

1. `ModeSync` effect calls `setTheme(previewTheme(mode))`, i.e. `setStored(newObject)`.
2. Provider re-renders; `activeTheme = {...stored, ...theme}` is a fresh object every render.
3. `value = useMemo(..., [activeTheme])` therefore recomputes every render, producing a new
   `setTheme` identity every render.
4. `ModeSync` subscribes to the context, re-renders on each new `value`, and its effect deps
   `[mode, setTheme]` change every time (`setTheme` identity) — so the effect re-fires and
   calls `setStored(newObject)` again. Loop back to 2, unbounded: hang in isolation, worker
   OOM under nx's parallel load.

The `setTheme` identity instability is inside the published `Provider`, which this task must
not touch — so no in-scope fix exists and none was attempted. The 7 tests were already RED-verified
against the missing-module failure last session; they remain the correct GREEN criterion once
the loop source is resolved by a further plan amendment.

Working tree state: `packages/preview/` (12 files, amended) untracked, `pnpm-lock.yaml`
workspace-link update modified, root `package.json` untouched. This entry committed alone.

## Task 2 completed — PASS (2026-09-25)

Applied amendment `4279d46` (guarded `ModeSync`): reads both `theme` and `setTheme` from
`useTheme()`, holds `setTheme` in a ref, and only syncs when `theme.mode !== mode` with deps
`[mode, theme.mode]`. All other WIP files byte-identical; tests unmodified.

### Gate tails (all with --skip-nx-cache)

- `nx run-many -t test typecheck lint --projects=preview`: green.
  `preview:test`: 7/7 pass (incl. both toggle tests and the reduced-motion test), 320 ms.
- `nx run preview:build`: green. `dist/` contains exactly `index.js`, `index.cjs`,
  `index.d.ts`, `styles.css`; no `dist/mdx.*` (ships with Task 3).
- Step 10: root `package.json` `test`/`lint`/`typecheck` scripts now list
  `tokens,react,react-native,brand,styling,preview` (verified via node).
- TDD record: RED (`Failed to resolve import "./Preview"`) verified before implementation;
  intermediate 5/7 (controlled-prop drop) and hang (unguarded setTheme loop) failures
  documented above; final GREEN is 7/7 unmodified tests.

Committed per Step 11 as `feat(preview): public @xerena/preview package with live Preview surface`.

## Task 3 completed — PASS (2026-09-25)

MDX source-capture plugin (`previewCodePlugin`) with explicit-code escape hatch.

### Gate tails (all with --skip-nx-cache)

- `nx run-many -t test typecheck lint build --projects=preview`: green.
  `preview:test`: 12/12 pass (7 Preview + 5 mdx), 3.44 s.
  `preview:typecheck`: clean. `preview:lint`: clean. `preview:build`: green.
- `dist/` contains `mdx.js`, `mdx.cjs`, `mdx.d.ts` alongside the index outputs
  (`index.js`, `index.cjs`, `index.d.ts`) and `styles.css`.
- TDD record: RED (`Failed to resolve import "./mdx"`) verified before implementation;
  final GREEN is 5/5 unmodified plugin tests.
- `src/index.ts` untouched: the plugin stays out of the React entry and ships only
  through the `./mdx` export map.

### Notes

- The plugin lives at `src/mdx.ts` (the spec file map says `src/mdx-entry.ts` — the
  shorter name won because the export map already namespaces it as `@xerena/preview/mdx`).
- Known limitation (by design): inline `<Preview>` inside a paragraph
  (`mdxJsxTextElement`) is not handled — previews are block-level only.
- Plan amendment applied during this task: the `attributes` local in `visit` is
  annotated `MdxJsxAttribute[]`, consuming the structural interface so lint
  (`no-unused-vars`) passes. No other change versus the specified source.

Committed per Step 6 as `feat(preview): MDX source-capture plugin with explicit-code escape hatch`.

## Task 4 completed — PASS (2026-09-25)

Docs scaffold: Next.js 16 + fumadocs static export. All 8 steps executed in order.

### Step 1: deps (exact, verified)

Installed per plan; `apps/docs/package.json` now lists
`next@16.3.6 react@19.3.0 react-dom@19.3.0 fumadocs-core@16.15.14
fumadocs-ui@16.15.14 fumadocs-mdx@15.4.4 tailwindcss@4.3.3
@tailwindcss/postcss@^4 @xerena/react@workspace:* @xerena/preview@workspace:*`
plus dev `typescript@^5.6.0 @types/react @types/react-dom @types/mdx
@types/node@26.6.2 eslint@^9 @xerena/eslint-config@workspace:*`.
`@xerena/tokens` deliberately absent (token values arrive at runtime via
`@xerena/react/styles.css`). `@types/node` pinned at 26.6.2 per Task 1.
Peer warnings (harmless, recorded): `fumadocs-mdx` wants vite `7.x || 8.x`
but the repo root resolves vite 5.4.21; legacy `vitepress` wants react
`<19` while the app now uses react 19.3.0 (vitepress toolchain dies in
Task 5 Step 6).

### Steps 2-5: files written

- `next.config.mjs`: verbatim (`output: 'export'`, `basePath: '/xerena-ui'`,
  `trailingSlash: true`, `withMDX` wrapper).
- `source.config.ts`: verbatim (`defineDocs`/`defineConfig` from
  `fumadocs-mdx/config`, `previewCodePlugin` in `mdxOptions.remarkPlugins`).
  No Task 1 deviation needed: the `fumadocs-mdx/config` shape is present in
  the installed version.
- `postcss.config.mjs`: verbatim. `tsconfig.json`: verbatim (`jsx: preserve`).
- `lib/source.ts`, `app/layout.tsx` (`fumadocs-ui/provider/next`
  RootProvider per Task 1 deviation 1), `mdx-components.tsx` (Preview
  registered), `app/docs/layout.tsx` (DocsLayout per deviation 2),
  `app/docs/[[...slug]]/page.tsx`, `app/api/search/route.ts`: all verbatim.
- Specified-shape files the plan leaves to the executor (recorded here):
  `eslint.config.js` is the shared-base shape (`import base from
  '@xerena/eslint-config'`, spread) plus an ignores block — see deviation 1
  below. `project.json` keeps name `docs`, dev `next dev`, build
  `next build` with outputs `{projectRoot}/out`, typecheck
  `tsc -p tsconfig.json --noEmit`, lint `eslint .`.
  `app/page.tsx` is a minimal landing (`Xerena UI` heading plus
  `<Link href="/docs">Read the docs</Link>`; basePath applied automatically).
  `content/docs/meta.json` is `{"title": "Documentation", "pages": ["index"]}`.
  `content/docs/index.mdx` is a one-paragraph placeholder with
  `title: Welcome` / `description: Xerena UI documentation` frontmatter.

### Token variable table (app/global.css)

fumadocs theme variables live in `fumadocs-ui/css/lib/default-colors.css`
as Tailwind v4 `@theme` tokens (`--color-fd-*`). Overrides are explicit
`:root` rules after the tailwind/neutral/preset imports (unlayered rules win
over the layered `@theme` emission). Light values reference the live
`--xr-*` variables from `@xerena/react/styles.css`; `.dark` values are
literals because the `--xr-*` dark palette is scoped to
`[data-xerena-theme='dark']`, which the docs shell never sets (fumadocs dark
mode uses `.dark`). Hexes verified in `packages/tokens/dist/tokens.css`.

| fumadocs var | xr var | light | dark |
|---|---|---|---|
| --color-fd-background | --xr-semantic-color-background | #faf7f2 | #1b1712 |
| --color-fd-foreground | --xr-semantic-color-text | #2b2620 | #f0ece3 |
| --color-fd-muted | --xr-semantic-color-surface | #f4efe6 | #262019 |
| --color-fd-muted-foreground | --xr-semantic-color-textMuted | #9a8f7e | #9a9184 |
| --color-fd-card | --xr-semantic-color-surface | #f4efe6 | #262019 |
| --color-fd-card-foreground | --xr-semantic-color-text | #2b2620 | #f0ece3 |
| --color-fd-popover | --xr-semantic-color-background | #faf7f2 | #1b1712 |
| --color-fd-popover-foreground | --xr-semantic-color-text | #2b2620 | #f0ece3 |
| --color-fd-border | --xr-semantic-color-border | #f4efe6 | #262019 |
| --color-fd-primary | --xr-semantic-color-primary | #c04e1d | #da854f |
| --color-fd-primary-foreground | --xr-semantic-color-textOnStrong | #faf7f2 | #f0ece3 |
| --color-fd-secondary | --xr-semantic-color-surface | #f4efe6 | #262019 |
| --color-fd-secondary-foreground | --xr-semantic-color-text | #2b2620 | #f0ece3 |
| --color-fd-accent | --xr-semantic-color-surfaceHover | #fdf1e9 | #aca496 |
| --color-fd-accent-foreground | --xr-semantic-color-text | #2b2620 | #f0ece3 |
| --color-fd-ring | --xr-semantic-color-borderStrong | #9a8f7e | #9a9184 |

### Step 6: archive

`guide/` + `brand.md` + `index.md` moved via `git mv` to `content-legacy/`
(history preserved). `content/docs/` holds only `index.mdx` + `meta.json`.
`.vitepress/` untouched (dies in Task 5 Step 6).

### Step 7: gates (all with --skip-nx-cache)

- Plain `pnpm install`: lockfile up to date path, 22 packages linked.
- `nx run docs:build`: green. Routes: `/`, `/_not-found`, `/api/search`,
  `/docs` (SSG via `generateStaticParams`).
- `apps/docs/out/index.html` exists.
- `apps/docs/out/api/search` exists (extensionless file, payload opens with
  `{"type":"advanced",...}` — zbsearch, as Task 1 noted; the exact recorded
  path asserted, no `*search*.json` guess).
- `nx run docs:typecheck`: clean (with the committed `jsx: preserve`
  tsconfig).
- `nx run docs:lint`: clean after deviation 1 (before: 16252 errors, all in
  generated/legacy dirs, zero in hand-written source).
- Root `package.json`: `lint` and `typecheck` gained `docs`; `test`
  unchanged (docs has no unit tests).

### Deviations (2, both minimal and recorded)

1. `apps/docs/eslint.config.js` adds an ignores block
   (`.next/**`, `.source/**`, `out/**`, `.vitepress/**`, `next-env.d.ts`)
   on top of the shared-base shape. Without it `eslint .` lints Next/fumadocs
   build output and the legacy `.vitepress/dist` bundle (16252 errors, all in
   those dirs). The shared base only ignores `dist/**`, `lib/**`,
   `node_modules/**`, `coverage/**`, `storybook-static/**`, which does not
   cover Next.js outputs. The specified `eslint .` command is unchanged.
2. `apps/docs/tsconfig.json` is committed with the specified `jsx: preserve`
   content although every `next build` rewrites it in the working tree to
   `jsx: react-jsx` plus `lib`/`allowJs`/`noEmit`/`incremental` (Task 1 notes
   predicted this; committing `preserve` is the blessed behavior — Next
   re-adjusts automatically and the build gate passed).

Committed per Step 8 as `feat(docs): rebuild docs app on Next.js + fumadocs with static export`.

## Task 5: Port guides + 3 pilots — BLOCKED (2026-09-25)

Steps 1–3 executed in order and content-verified (see below). Step 4 gate
is red: `docs:build` fails on two independent defects, both outside Task 5
scope (`apps/docs/content` only). Per the brief ("on failure: stop and
report"), stopped before Step 4 meta updates, Step 5 commit, and Step 6.
No commits made for Task 5. Working tree holds the Step 1–3 files
(uncommitted) plus the `__spike` proof scaffolding (also uncommitted).

### Steps 1–3 (done, verified)

- Step 1: `content/docs/guide/{getting-started,theming,motion,styling,native}.mdx`
  + `content/docs/brand.mdx`. Body byte-identical to `content-legacy`
  counterparts (verified via `diff` past a 5-line title/description
  frontmatter block); headings, tables, RN notes unchanged. No `:::`
  containers exist in any of the six sources (grep exit 1), so the Callout
  rule applies only to the pilots.
- Step 2: `components/actions/_button-demo.tsx` verbatim per plan
  (`'use client'` first line, `<Preview title + explicit code>`), and
  `button.mdx` (legacy prose/table + `<Callout title="React Native">` in
  place of the `::: tip` block + `<ButtonDemo />` after Usage). Content
  diff vs legacy shows only the frontmatter/imports/Callout/demo deltas.
- Step 3: `_select-demo.tsx` (controlled native `<select>`, value state
  exercises pick/close) and `_dialog-demo.tsx` (exact compound API:
  `Dialog.Root/Portal/Overlay/Content/Close/Title/Description`; open via
  native `<button>`, dismiss via two `Dialog.Close` controls), each
  `'use client'` + explicit reader-facing `code` prop inside `<Preview>`;
  `select.mdx` / `dialog.mdx` ported the same way as Button. Content diffs
  clean (same expected deltas only).
- Recipe notes for the scale phase: (a) `ButtonProps` has no `onClick`
  (excess-prop type error), so demos use a native `<button>` for triggers
  and `Dialog.Close` for in-dialog dismissal; (b) colocated `_*-demo.tsx`
  files resolve fine as relative MDX imports (the button failure below
  happens at demo module *evaluation*, i.e. after successful resolution);
  (c) all 9 new MDX files compile — both failures below are
  prerender-execution errors, never MDX parse errors — and explicit
  `Callout`/`Demo` imports in MDX work without global registration.

### Step 4 proof attempt 1 (spike + temp meta entry): FAIL

`content/docs/__spike.mdx` verbatim per plan (no imports, plain-HTML
`<Preview>`), `meta.json` temporarily gained `"__spike"`.
`nx run docs:build --skip-nx-cache` fails prerendering `/docs/__spike`:

```text
Error: Expected component `Preview` to be defined: you likely forgot to import, pass, or provide it.
    at <unknown> (content/docs/__spike.mdx.js?collection=docs:32:9)
```

Root cause (traced, not guessed): `app/docs/[[...slug]]/page.tsx`
(Task 4 verbatim) renders `<MDX />` with no `components` prop, and
`mdx-components.tsx` exports only `getMDXComponents` — which nothing
calls. Next.js honors only the `useMDXComponents` export (per
`node_modules/next/dist/docs/.../mdx-components.md`), and nothing in
`fumadocs-mdx`/`fumadocs-ui` dist references `getMDXComponents` either
(grep over all three dists: zero hits), so the global registry —
including Preview and the fumadocs default components — never reaches
the page. Task 1 could not catch this (ledger: "the `Preview` key ...
could not be exercised in the spike"). Proposed fix (Task 4 scope, needs
plan amendment + own commit): in the docs page, `import
{ getMDXComponents } from '@/mdx-components'` and render `<MDX
components={getMDXComponents()} />`. Do NOT work around it with an
explicit Preview import in the spike — that would mask the defect the
proof exists to catch.

### Step 4 proof attempt 2 (spike moved aside, meta reverted): FAIL

Same command, now fails prerendering `/docs/components/actions/button`:

```text
Error: Minified React error #527; visit https://react.dev/errors/527?args[]=19.3.0-canary-cbb046ab-20260731&args[]=19.3.0 ...
    at <unknown> (../../packages/react/dist/index.js:11983:11)
    at module evaluation (../../packages/react/dist/index.js:12048:1)
    at module evaluation (content/docs/components/actions/_button-demo.tsx:3:1)
```

Root cause (traced, not guessed): `packages/react/src/components/feedback/Toast.tsx:2`
imports `react-dom/client`, but `packages/react/vite.config.ts` externals
only exact-match `'react-dom'` — so a full second copy of react-dom is
bundled into `@xerena/react/dist/index.js` (two `rendererPackageName:
"react-dom"` regions, lines ~11999 and ~30812). At docs prerender, that
bundled react-dom 19.3.0 reads `react` as resolved by Next 16, which is
Next's own compiled canary (`19.3.0-canary-cbb046ab-20260731`, confirmed
present in `.next/server/chunks/0k09_next_dist_compiled_*.js`; no canary
exists in `pnpm-lock.yaml` or on disk) — exact-version check fails.
Invisible to the package's own suite (vitest resolves workspace stable
19.3.0 everywhere). Proposed fix (`packages/react` scope, needs plan
amendment + own commit with review): external `react-dom/client` (and
`react/jsx-runtime` for safety) in `vite.config.ts`, rebuild, re-run
`docs:build`.

### State left for the amendment session

- Uncommitted: 6 guide/brand `.mdx`, 3 pilot `.mdx`, 3 `_*-demo.tsx`,
  `__spike.mdx`, `content/docs/meta.json` (`"__spike"` entry = proof
  scaffolding, final section meta.jsons NOT yet written), this ledger
  entry. `apps/docs/tsconfig.json` build churn restored via checkout.
- `git status --short` shows only the above (plus no other modifications).
- Step 4 order preserved for retry: files are in place up to the spike
  proof; after both fixes land elsewhere, resume at Step 4 (assert spike
  HTML → delete spike → write final meta.jsons → `docs:build` green).

## Task 5 resumed after unblockers — BLOCKED again on a NEW failure (2026-09-25)

Resumed per brief on `feat/docs-preview-phase7` at `a63ab2a`, WIP intact
(all six guide/brand bodies re-verified byte-identical; spike + 3 demos
start with `'use client'`; meta.json holds the `"__spike"` entry;
`@xerena/preview` dist entries start with `'use client'`; `grep -c
rendererPackageName packages/react/dist/index.js` = 0). Prior fixes
e033dcf (MDX wiring), a040a37 (react externals), a63ab2a (preview
`'use client'`) verified present — not re-fixed.

Step 4 spike-proof build (`pnpm exec nx run docs:build --skip-nx-cache`,
spike + meta entry already staged): FAIL, new error. The old `Expected
component 'Preview' to be defined` is gone (fix 1 works — global
registration resolves). Prerender of `/docs/__spike` now fails with:

```text
Error: Minified React error #527; visit https://react.dev/errors/527?args[]=19.3.0-canary-cbb046ab-20260731&args[]=19.3.0 ...
Export encountered an error on /docs/[[...slug]]/page: /docs/__spike, exiting the build.
```

Root cause (traced, not guessed — no fix attempted, out of Task 5 scope):

1. `next/dist/compiled/react` (the non-experimental channel Next 16.3.6
   uses by default) is itself canary `19.3.0-canary-cbb046ab-20260731`
   (extracted from `compiled/react/cjs/react.production.js`; the
   `-experimental` twin is `19.3.0-experimental-...`). No canary exists in
   `pnpm-lock.yaml` or the workspace — it ships inside Next.
2. The SSR prerender chunk (`apps/docs/.next/server/chunks/ssr/_0u2mzfc._.js`,
   sourcemap-verified) pairs that vendored canary `react`
   (`next/dist/compiled/react/index.js`) with the workspace stable
   `react-dom@19.3.0`, which `@xerena/react/dist/index.js` pulls in via its
   top-level external `import ... from "react-dom"` (line 3, for
   `createPortal`; importing any export evaluates the whole single-file
   dist, so every demo and the spike trigger it).
3. Stable react-dom's module-eval exact-version check
   (`React.version !== '19.3.0'`) reads the canary react and throws #527.
   Workspace `react` itself is stable 19.3.0 (node resolution confirms) —
   the canary wins only inside Next's SSR graph, so package suites and
   `tsc` stay green while `docs:build` prerender dies.

Why this is a NEW failure, not the old one: previously the bundled
react-dom inside `@xerena/react/dist` threw; now the dist is clean
(0 bundled copies) and the throw comes from the workspace stable
react-dom module meeting Next's vendored canary react — a toolchain
pairing issue no `apps/docs/content` change can fix (any MDX or demo
importing `@xerena/react`, `@xerena/preview`, or `react-dom` hits it;
the spike needs Preview, the pilots need demos — all paths blocked).

Candidate directions (all outside Task 5 scope — need plan amendment,
none attempted): align workspace react/react-dom with Next's vendored
channel; alias `react`/`react-dom` consistently in `next.config.mjs`
(Task 4 scope); or remove the top-level `react-dom` import from
`@xerena/react`'s entry (code-split/lazy — `packages/react` scope,
published package). Stopping per brief.

State left: same WIP as before (6 guide/brand `.mdx`, 3 pilot `.mdx`,
3 `_*-demo.tsx`, `__spike.mdx`, meta.json `"__spike"` scaffolding, this
entry — all uncommitted, no commits made); `apps/docs/tsconfig.json`
build churn restored via checkout. Resume again at Step 4 once amended.

## Task 4c: SSR-safe overlays — BLOCKED on a focus regression (2026-09-25)

Steps 1-2 executed verbatim; Step 3 test conversion done with same-strength
assertions only. Step 3 `react:test` gate is red on 2 Menu focus tests whose
root cause is a real behavior regression in the specified approach, fixable
only in `Menu.tsx` (out of brief scope). Step 4 `docs:build` still fails with
the identical error #527 on `/docs/__spike` — workspace dists are proven
clean, so the remaining poisoning path is third-party. Per the brief ("on
failure: stop and report"), stopped before Step 4 commit. No commits made.
All Task 4c WIP below is uncommitted in the working tree.

### Step 1: Toast.tsx lazy createRoot — DONE verbatim

- Top-level value import replaced with `import type { Root } from
  'react-dom/client'` (erased at compile, SSR-safe); `useEffect` import kept.
- `let root: Root | null`, `async ensureRoot()` loads `createRoot` via
  `await import('react-dom/client')` inside the client-only path, then
  creates/appends `#xerena-toast-stack` exactly as before.
- `flush()` is fire-and-forget (`void ensureRoot().then((r) => r.render(...))`)
  with the stack JSX byte-identical. `Toast`, `TOAST_STACK`,
  `setToastThemeMode`, `toast()` shapes identical; `toast()` stays sync-void.

### Step 2: OverlayPrimitive.tsx lazy createPortal — DONE verbatim, hooks verified

Hook verification FIRST (per plan — no guard needed, recorded here):

- `useFocusTrap` touches `document` only at lines 22/25, inside the `onKey`
  handler defined within its `useEffect` (lines 12-32). Render body
  (`useRef` + `useEffect` + `return ref`) touches nothing.
- `useDismissable` touches `document` only at lines 18-19/21-22, inside its
  `useEffect` (lines 9-24). Render body touches nothing.
- Neither hook was guarded; both are SSR-safe as written.

Implementation matches the specified shape exactly: `PortalFn` type,
`useState<PortalFn | null>(null)` + mount `useEffect` with `live` flag doing
`void import('react-dom').then((m) => { if (live) setPortal(() => m.createPortal) })`,
`if (!open || !portal) return null`, and `document.body` reached only as the
`portal(...)` container after client-side load. Portal wrapper JSX unchanged.

### Step 3: tests + gates — RED on 2 Menu tests (blocker, see below)

RED verified before conversion: 8 failures across OverlayPrimitive (3),
dialog (2), drawer (3), popover (flaky 1) — all "element not found", i.e. the
portal now appears one effect tick after mount. `toast.test.tsx` was already
async and stayed green untouched.

Converted to async with SAME assertions (no test deleted, none weakened —
`getBy*` to `findBy*` / `waitFor` only):

- `OverlayPrimitive.test.tsx`: 3 tests async (`findByText`, `waitFor` on the
  `[data-xerena-overlay]` theme assertions); Escape + close-removal parts
  unchanged and still sync (deterministic: listeners attach on mount,
  `open={false}` returns null synchronously).
- `dialog.test.tsx`: aria-modal test uses `findByRole`; labelledby test wraps
  the `aria-labelledby` assertions in `waitFor` (Title sets it via effect after
  the portal mounts); auto-id test waits for the attribute before reading it.
- `drawer.test.tsx`: 4 tests async (`findByText`); closed-state `queryBy`
  assertions stay sync.
- `popover.test.tsx`: `findByText('Panel')` (was flaky: failed one run, passed
  the next — now deterministic).

Gate tails (all with --skip-nx-cache):

- `nx run react:build`: green.
- Exact grep proof: `grep -nE "^import.*react-dom|^import.*from \"react-dom"
  packages/react/dist/index.js` exits 1 (no top-level react-dom import).
  `react-dom` survives in dist only as dynamic bare imports — line 58
  `await import("react-dom/client")` (toast) and line 194
  `import("react-dom").then(...)` (overlay); `createPortal|createRoot` count
  is 2 (usages only, zero bundled definitions). `packages/preview/dist/index.js`
  contains zero `react-dom` references.
- `nx run-many -t test typecheck lint --projects=react`: test 105/107
  (50/51 files) — only `menu.test.tsx` 2 failures (blocker); typecheck and
  lint run separately afterward: both green.

### Blocker: lazy portal breaks Menu focus-on-open (needs Menu.tsx, out of scope)

Failing (unchanged, still sync — waiting cannot fix them):

- `Menu > opens on trigger click and focuses the first item`
- `Menu > navigates items with arrows and closes on Escape returning focus
  to the trigger`

Root cause (traced, not guessed — `Menu.tsx:29-34`): `Menu.Content` focuses
the first item in `useEffect(..., [open])`. With the specified lazy portal,
opening renders OverlayPrimitive `null` for one tick (portal not loaded), so
`contentRef.current` is still null when that effect runs and the focus call
is a no-op; when the portal mounts, `open` has not changed, so the effect
never re-runs and focus stays on the trigger. Same commit also orphans
`useFocusTrap` wiring for Dialog/Drawer: its effect deps `[open, ref.current]`
are unchanged across the portal-load commit while the element only appears at
that commit (`if (!el) return` taken on mount, never re-run) — Tab-trapping is
silently dead (no suite test covers it; proven by scratch probe B below).

Proof (scratch file, since deleted — never part of the suite):

- Probe A (menu focus with 1000 ms `waitFor`): FAILS with the Step-2 code
  (focus stays on trigger), PASSES on stashed baseline (verified via
  `git stash push` of the two source files + rerun: 2/2 pass, then
  `git stash pop` restored all WIP).
- Probe B (Dialog Tab-wrap: focus Last, dispatch bubbling Tab, expect First
  focused): FAILS with the Step-2 code, PASSES on baseline. Same stash
  experiment, same result.

Not attempted (all out of brief scope, which limits sources to Toast.tsx +
OverlayPrimitive.tsx): touching `Menu.tsx` (e.g. re-running its focus effect
once portal content mounts), reordering/gating hooks inside OverlayPrimitive
beyond the specified snippet, or weakening the 2 Menu assertions to fake the
gate green. Candidate directions for amendment: make the focus effect in
`Menu.tsx` portal-aware; or re-run element-dependent effects in
OverlayPrimitive once the portal mounts (deviates from the specified snippet
and still cannot rescue Menu's own `[open]` effect without a Menu.tsx change).

### Step 4: docs:build reach — still the identical error #527 (not fixed by 4c)

`nx run docs:build --skip-nx-cache` (fresh lazy `react` dist confirmed in
place — dist lines 58/194 above) fails prerendering `/docs/__spike` with the
byte-identical error:

```text
Error: Minified React error #527; visit https://react.dev/errors/527?args[]=19.3.0-canary-cbb046ab-20260731&args[]=19.3.0 ...
Export encountered an error on /docs/[[...slug]]/page: /docs/__spike, exiting the build.
```

The spike page uses zero overlay components (Preview + plain button), and both
workspace dists are proven `react-dom`-clean at module-eval time, so Task 4c
cannot move this build further. Read-only grep points at the remaining
third-party path: `fumadocs-ui/dist` carries top-level static `react-dom`
imports evaluated in the same SSR graph (`layouts/flux/page/slots/toc.js`
`createPortal`, `provider/base.js` + `components/sidebar/base.js` +
`layouts/shared/slots/theme-switch.js` `flushSync`, plus
`react-medium-image-zoom`), which meet Next 16's vendored canary react
(`19.3.0-canary-cbb046ab-20260731`) and throw the same exact-version check.
Needs plan amendment (toolchain channel alignment or similar) — not more
`@xerena/react` surgery. Do not retry pinning/aliasing without amendment
(plan already records those as rejected).

### State left for the amendment session

- Uncommitted Task 4c WIP: `packages/react/src/components/feedback/Toast.tsx`,
  `packages/react/src/primitives/OverlayPrimitive.tsx`,
  `packages/react/src/primitives/OverlayPrimitive.test.tsx`,
  `packages/react/src/components/feedback/dialog.test.tsx`,
  `packages/react/src/components/feedback/drawer.test.tsx`,
  `packages/react/src/components/feedback/popover.test.tsx`, plus this entry.
  Pre-existing Task 5 WIP untouched (`apps/docs/content/...`, `__spike.mdx`,
  `meta.json`, `tsconfig.json` churn).
- No commits made; no weakened assertions (zero); no files outside
  `packages/react/src` + ledger touched.
- Resume: amend the plan for (1) Menu/focus-trap portal-awareness and (2) the
  fumadocs-ui SSR react-dom path; then re-run Step 3 gates + Step 4
  `docs:build` before any commit.

## Task 5 completed — PASS (2026-09-25, amended plan: client-only demo boundary)

Resumed at amended Step 0 on `feat/docs-preview-phase7` (`76d228f` in HEAD).
Preconditions verified: prior WIP intact; Task 4c WIP reverted via checkout
(6 files, no separate commit, `git status` confirms zero `packages/react`
changes); e033dcf/a040a37/a63ab2a/76d228f all in HEAD.

### Step 0 (done, committed alone as 84ae510)

Removed `Preview` import + mapping from `apps/docs/mdx-components.tsx`
(kept `defaultMdxComponents` + function shape). Exact message:
`fix(docs): drop Preview from server MDX map (client demos own it)`.

### Steps 1–3 (done)

Guides/brand unchanged from the stopped attempt (byte-identical bodies,
re-verified). Demos already owned `<Preview title code>` — kept. Pilot MDX
pages restructured from static demo imports to the client-only boundary.

Ruling 1 — bare `const X = dynamic(...)` in MDX does not parse: all three
pilots failed compile with `10:6: Could not parse expression with acorn /
Unexpected content after expression`. Isolated probe over remark-mdx
(`packages/preview` devDeps): bare-const PARSE FAIL, `export const`
PARSE OK (MDX ESM nodes must be import/export; the options object was
tokenized as an expression container). First fixed with `export const`.
— Cost if wrong: nil (probe-proven; build-confirmed).

Ruling 2 — `dynamic(..., { ssr: false })` is illegal in a Server Component
(Turbopack: "`ssr: false` is not allowed with `next/dynamic` in Server
Components. Please move it into a Client Component"), so the plan's inline
pattern cannot work as written. Replaced with colocated `'use client'`
`_*-loader.tsx` files exporting the same `dynamic()` call (same target,
same `ssr: false`, same `<p>Loading preview…</p>` fallback); MDX pages
statically import the loader (`import { ButtonDemo } from
'./_button-demo-loader'`) and render `<ButtonDemo />` unchanged. Preserves
every load-bearing property: no `@xerena` module in any server graph
(MDX top-level imports are only `next/dynamic`→loader chain,
`fumadocs-ui/components/callout`, and prose/fence text). — Cost if wrong:
3 small files the scale phase copies as a pair.

Ruling 3 — kept explicit `import { Callout }` in pilot MDX (the amended
"only dynamic() calls and prose" cannot be literal since `<XxxDemo />`
usage is itself JSX and is mandated; the Callout rule mandates
`<Callout>` without specifying resolution). Explicit import is safe: the
amended plan verifies fumadocs-ui's graph is `react-dom`-free. — Cost if
wrong: one-line-per-page change to global resolution.

### Step 4 (done — gate green)

Plugin REGISTRATION proven at the compilation layer: `docs:build` with the
verbatim `__spike.mdx` fails prerender with exactly the predicted
`Expected component 'Preview' to be defined` (proves the page compiled;
not fixed), and the emitted SSR chunk contains the injected
`code:'<button type="button">Plain</button>'` verbatim alongside
`_missingMdxReference("Preview")` — a string that can only exist if
`previewCodePlugin` ran in the fumadocs-mdx pipeline. Spike file deleted,
`__spike` meta entry removed; final `out/` verified free of `*spike*`.
Final meta.jsons: root `["index","guide","brand","components"]`,
guide (5 pages), components (`actions`/`form`/`feedback`), one leaf
`meta.json` per pilot category (mirrors legacy sidebar names).
`docs:build --skip-nx-cache`: exit 0, 14/14 static pages; routes asserted
in `out/` (index, brand, 5 guides, 3 pilots); static search payload at
`out/api/search` (560508 bytes). `docs:typecheck` + `docs:lint` clean.
Render check: dev serves under basePath (`/xerena-ui/...` → 200 after
trailing-slash redirect for button/dialog/theming); SSR HTML carries the
`<p>Loading preview…</p>` fallback. Consequence of the client-only
boundary (recorded, not a gap): code panels render post-hydration, so
static HTML cannot show them — substituted with client-bundle evidence
(all three explicit `code` strings + `xr-preview__code` surface present in
`out/_next/static/chunks/`) plus Task 2's verbatim-code unit tests (7/7).

### Per-page recipe for the scale phase

Per component: `_name-demo.tsx` (`'use client'`, owns `<Preview title
code>` with reader-facing source, exact web API) + `_name-demo-loader.tsx`
(`'use client'`, re-exports the same `dynamic(ssr:false)` call) + page
MDX (frontmatter, Callout/demo-loader imports only, ported prose/tables,
`<Demo/>` after Usage). Never: `@xerena` imports or `<Preview>` in MDX,
`react-dom`-touching modules in any server graph. Colocated `_*.tsx`
files are ignored by the fumadocs loader for routing (build-proven) but
resolvable as relative imports. Note: `ButtonProps` has no `onClick`
(excess-prop error) — demos use a native `<button>` trigger and
`Dialog.Close` for dismissal.

Committed per Step 5 as `docs: port guides and Button/Select/Dialog
pilots with live previews`. Step 6 follows after the gate.
