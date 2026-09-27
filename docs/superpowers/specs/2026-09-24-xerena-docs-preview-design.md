# Xerena — Documentation Site & Preview Component (Phase 7)

- **Date:** 2026-09-24
- **Status:** Draft — pending spec review before planning
- **Predecessor:** `docs/superpowers/specs/2026-09-15-xerena-native-design.md` (Phase 6 Native Components, complete)
- **Deliverables:** public `@xerena/preview` package + rebuilt documentation site (fumadocs) + manual GitHub Pages deploy workflow
- **Out of scope:** component registry (future phase), props playground, deploying the site now

## Context

Phases 1–6 are complete: `@xerena/tokens`, `@xerena/brand`, `@xerena/styling`, `@xerena/react` (42 web components), and `@xerena/native` (42 native components) are built, reviewed, and — except native — published to npm.

The documentation site (`apps/docs`) today is VitePress 1.6.4 and has two blocking properties discovered during this design:

1. **It cannot render MDX.** VitePress 1.6.4 globs `glob(["**.md"])` and uses `INDEX_OR_EXT_RE = /(?:(^|\/)index)?\.(?:md|html)$/`. The only occurrence of `mdx` in the package is a MIME-type table. VitePress 2 exists but is `2.0.0-alpha.20` and is also Vue-based, not MDX.
2. **It is Vue-based, and our components are React.** Live React examples would require a React-island bridge.

Consequence: the current site can only show prose and static code fences. There is no way to show a working `<Button>`, a working `<Dialog>`, or a working `<Select>` inside a docs page. Every interactive example lives in Storybook, which is the right place for exhaustive variant exploration but the wrong place for "explain this concept with one live example".

## Objectives

1. Ship `@xerena/preview` as a **public npm package** usable by any React consumer: a preview surface that renders live components, shows the source that produced them, and can be switched between light and dark without affecting the host page's theme.
2. Rebuild the documentation site so component pages contain **live, interactive examples** authored once (no duplicated code sample).
3. Target **GitHub Pages via static export**, with a **manually triggered** GitHub Actions workflow. No automatic deploys.
4. Keep Storybook as-is for exhaustive variant/interaction/a11y exploration; the docs stay concise and link out.
5. Leave the site in a state where a component registry can be added later without rework.

## Key Decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | Replace VitePress with **fumadocs** (Next.js 16 App Router + `fumadocs-ui` + Tailwind CSS 4) | Only option that gives native MDX **and** native React, so `@xerena/preview` needs no bridge. Also ships a CLI that installs components into consumer repos — directly useful for the future registry. |
| 2 | Tailwind CSS 4 is scoped to `apps/docs` only | fumadocs-ui is Tailwind-based. `@xerena/*` packages stay Tailwind-free and keep using `@xerena/styling` + CSS variables. The new `@xerena/preview` package is also Tailwind-free. |
| 3 | Preview package is public: `@xerena/preview` | User decision: publish it, and later expose a registry so other users can install it. |
| 4 | Preview features: live render + automatically captured source + per-preview light/dark toggle. **No props playground.** | Playground duplicates Storybook. Storybook remains the exploration surface; docs stay concise. |
| 5 | Source code is captured **at build time** by an MDX plugin | Runtime recovery of source from compiled JSX is impossible, so auto-extraction must happen in the MDX pipeline. An explicit `code` prop remains as an escape hatch. |
| 6 | Target is **static export** (`output: 'export'`) | Docs must be servable from GitHub Pages with no Node server. fumadocs fully supports this; Orama search has a documented static mode. |
| 7 | Deploy is **manual** (`workflow_dispatch`) | User decision: prepare the workflow, do not deploy yet. |
| 8 | VitePress is deleted **after** content port is verified | Keeps a working site until the replacement proves out; avoids a window with no docs. |
| 9 | This phase ships framework + 3 pilot pages. The remaining 39 component pages are a **separate phase**. | User decision: prove the pattern first, then scale. |
| 10 | Release/publish of `@xerena/preview` is a **separate final step** | Matches the established Phase 6 → Phase 7 pattern in this repo. |

## Architecture

```
packages/preview/            → published as @xerena/preview (React, no Tailwind, no framework lock-in)
  src/Preview.tsx            live surface + code panel + theme toggle
  src/theme.ts               mode state; wraps children in @xerena/react <Provider>
  src/styles.css             plain CSS built from @xerena/tokens
  src/mdx.ts                 MDX/remark plugin: injects code={...} from <Preview> source
  src/index.ts               public exports (React core)
  src/mdx-entry.ts           @xerena/preview/mdx entry point

apps/docs/                   → rebuilt: Next.js 16 + fumadocs-ui + Tailwind 4
  content/docs/**.mdx        ported content (guides + component pages)
  content/docs/**/meta.json  file-based navigation
  source.config.ts           fumadocs-mdx collections (doc + meta)
  lib/source.ts              content loader
  app/layout.tsx             RootProvider (search: static) + theme tokens
  app/docs/[[...slug]]/      docs route
  app/api/search/route.ts    staticGET search index export
  next.config.mjs            output: 'export', basePath, trailingSlash

.github/workflows/docs.yml   workflow_dispatch → build → artifact → GitHub Pages
```

### `@xerena/preview` — API

```tsx
// Authoring in MDX (plugin injects code automatically)
<Preview title="Primary">
  <Button variant="primary" onClick={save}>Save</Button>
</Preview>

// Non-MDX consumers pass code explicitly
<Preview title="Primary" code="<Button variant='primary'>Save</Button>">
  <Button variant="primary" onClick={save}>Save</Button>
</Preview>
```

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `title` | `string` | — | Short caption above the surface. |
| `description` | `string` | — | Optional one-line explanation. |
| `code` | `string` | injected by plugin | Source shown in the code panel. |
| `defaultMode` | `'light' \| 'dark'` | `'light'` | Initial theme for this preview. |
| `showCode` | `boolean` | `true` | Whether the code panel starts open. |
| `children` | `ReactNode` | required | The live example. |

Behaviour:
- Children render inside `@xerena/react`'s `<Provider theme={{ mode }}>` using the resolved `@xerena/tokens` palette, so the preview matches the rest of the design system rather than only using unstyled primitives.
- The light/dark toggle is **local to the preview** (nested provider), so toggling one preview never flips the whole page.
- The code panel is a disclosure: a button toggles it; the panel is scrollable and horizontally scrollable for long lines.
- Reduced motion is honored through the existing `@xerena/react` styling conventions.

Peer dependencies: `react`, `react-dom`, `@xerena/react`. `@xerena/react` **must** be a peer, not a dependency, so the preview shares the host app's single React instance and theme context instead of creating a second copy.

### `@xerena/preview/mdx` — source capture

A remark/MDX plugin that walks the MDX AST, finds `<Preview>` elements, captures the raw source of each element's children, and injects it as the `code` prop. It is registered through the MDX compiler options in `source.config.ts` (fumadocs-mdx exposes MDX compiler customization).

Failure behaviour is explicit, not silent: if a `<Preview>` cannot be resolved, the plugin leaves the element untouched and the component falls back to an empty code panel.

### Documentation site

- **Content model:** `content/docs/**.mdx` with `meta.json` per directory for ordering and grouping — replaces the hand-maintained sidebar array in `.vitepress/config.mts`.
- **Navigation:** derived from the content tree, so adding a page requires no config edit.
- **Theming:** `@xerena/tokens` values are mapped into fumadocs CSS variables so the docs shell uses the same palette, typography, and radii as the design system.
- **Search:** Orama in static mode — `staticGET` from `createFromSource(source)` emits a cacheable static index; the client uses `type: 'static'`. Acceptable because the site is ~50 pages; if the corpus grows substantially, revisit a hosted search backend.
- **Static export:** `output: 'export'`, `basePath: '/xerena-ui'` (GitHub project pages), `trailingSlash: true` for robust static hosting.
- **Preview isolation:** interactive previews are client components inside MDX. Each preview is its own React root boundary, so a broken example cannot take down the page.

### Deploy workflow

`.github/workflows/docs.yml`:
- Trigger: `workflow_dispatch` only. No `push`/`schedule` triggers.
- Builds `apps/docs` with the static export.
- Uploads the `out/` directory as a workflow artifact and deploys through `actions/deploy-pages`.
- Guarded by repository Pages settings; the workflow is inert until someone dispatches it.

## Content Migration

| From (VitePress) | To (fumadocs) |
|---|---|
| `guide/getting-started.md` | `content/docs/guide/getting-started.mdx` |
| `guide/theming.md`, `motion.md`, `styling.md`, `native.md` | same paths as `.mdx` |
| `brand.md` | `content/docs/brand.mdx` |
| `guide/components/<category>/<name>.md` (42) | `content/docs/components/<category>/<name>.mdx` |
| `.vitepress/config.mts` sidebar array | `content/docs/**/meta.json` |
| `::: tip … :::` containers | `<Callout>` |
| prose + API tables | unchanged (MDX is a superset) |

The 20 pages that gained a "React Native" callout during Phase 6 keep an equivalent note in their MDX versions.

## Task Breakdown

| # | Task | Scope | Gate |
|---|---|---|---|
| 1 | Stack verification | Prove, in a throwaway branch, that Next 16 + fumadocs + Tailwind 4 builds under Nx, that `output: 'export'` emits a complete site, that Orama static search emits an index, and that a client component with `'use client'` renders inside MDX | Verification notes recorded in the ledger; throwaway artifacts removed |
| 2 | `@xerena/preview` package | Package skeleton, `<Preview>`, theme wrapper, `styles.css`, vitest + testing-library tests, Nx targets, package exports | `nx run-many -t test typecheck lint build --projects=preview` |
| 3 | MDX source capture | `@xerena/preview/mdx` plugin + unit tests (nested elements, attributes, multiple previews, unresolvable case) | plugin tests green |
| 4 | Docs scaffold | Next.js 16 app, fumadocs, Tailwind 4, theme token mapping, layouts, nav, static search, `basePath` | `docs:build` produces a static site; search index emitted |
| 5 | Port guides + 3 pilot component pages | All guide pages; the 3 pilots are **Button** (trivial, no state), **Select** (consumes `ListOverlay`/portal-ish behavior), and **Dialog** (overlay + dismissal + focus) — chosen to cover "simple", "list-driven", and "overlay-driven" shapes | `docs:build` green; previews render and are manually verified |
| 6 | Deploy workflow | `.github/workflows/docs.yml`, manual trigger, artifact + Pages deploy | Workflow validates (actionlint); not dispatched |
| 7 | **Scale to remaining pages** | Remaining component pages get MDX + live previews | Separate phase |
| 8 | Remove VitePress | Delete `apps/docs` VitePress sources, drop `vitepress` dep | No dangling references; `docs:build` still green |
| 9 | Publish `@xerena/preview` | Changeset, version, publish | Separate release step |

## Testing Strategy

- **`@xerena/preview`:** vitest + `@testing-library/react`, matching `@xerena/react`. Cover: renders children, code panel toggle, light/dark toggle is local and does not mutate the host theme, explicit `code` prop, and reduced-motion behavior.
- **MDX plugin:** unit tests over MDX source strings asserting the injected `code` prop, including nested JSX and the graceful no-op path.
- **Docs site:** `docs:build` is the primary gate — it type-checks MDX and fails on broken content. Add a smoke check that built output contains expected routes. No unit tests for the site itself.
- **Repo gates:** the new package joins the existing Nx targets; root `test`/`lint`/`typecheck` scripts gain `preview` and `docs` where meaningful.

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Next.js 16 + Tailwind 4 in a pnpm/Nx workspace that has neither → lockfile churn, install friction | Task 1 verifies installation and build before any real work; pin versions explicitly |
| Static search downloads the whole index to the browser | Acceptable at ~50 pages; revisit with a hosted backend if the corpus grows |
| Preview as a client component inside RSC MDX | Standard pattern; verified in Task 1; failures are isolated per preview |
| MDX plugin mis-extracting source from complex JSX | Unit tests per shape; explicit `code` prop as documented escape hatch |
| Porting 42 pages is content-heavy and could slip | Split out of this phase (Task 7 is a separate phase); VitePress stays until done |
| `@xerena/preview` shipping broken peer resolution for consumers | Declare peers explicitly; document install; verify a clean consumer install before publish |

## Out of Scope

- Component registry and `npx`-style install flow (future phase; the fumadocs CLI is a known head start)
- Props playground / variant switcher in docs (lives in Storybook)
- Any actual deploy to GitHub Pages
- Reworking the Storybook app
- Changes to `tokens`, `styling`, `react`, or `native` packages beyond what the preview needs

## Acceptance Criteria

- [ ] `@xerena/preview` builds, type-checks, lints, and tests green; peer deps declared; no Tailwind dependency
- [ ] An MDX page can render a live preview whose code panel shows the exact authored source
- [ ] Per-preview light/dark toggle works without affecting the rest of the page
- [ ] `apps/docs` builds to a complete static site with working navigation and search
- [ ] Guides and 3 pilot component pages ported with live previews
- [ ] Deploy workflow exists, is manual-only, and is not dispatched
- [ ] VitePress sources removed only after the port is verified
- [ ] Whole phase reviewed and approved before any publish

## Decision History

| # | Decision |
|---|---|
| 1 | Replace VitePress with fumadocs (Next.js 16 + fumadocs-ui + Tailwind 4) |
| 2 | Tailwind 4 scoped to `apps/docs`; `@xerena/*` packages stay Tailwind-free |
| 3 | Preview package is public: `@xerena/preview`; registry deferred to a future phase |
| 4 | Preview features: live render + auto-captured source + local light/dark toggle; no props playground |
| 5 | Source capture happens at build time in the MDX pipeline; `code` prop is the escape hatch |
| 6 | Static export (`output: 'export'`) targeting GitHub Pages with `basePath: '/xerena-ui'` |
| 7 | Deploy is manual via `workflow_dispatch`; no automatic deploys |
| 8 | VitePress deleted only after the content port is verified |
| 9 | This phase ships framework + 3 pilot pages; the other 39 pages are a separate phase |
| 10 | Publishing `@xerena/preview` is a separate final step, following the repo's established release pattern |
