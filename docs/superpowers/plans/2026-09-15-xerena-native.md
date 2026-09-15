# Xerena — Native Components Plan (Phase 6)

- **Date:** 2026-09-15
- **Spec:** `docs/superpowers/specs/2026-09-15-xerena-native-design.md`
- **Status:** Pending implementation (architect review resolved — P0 fixes landed in spec; P1/P2 folded in; see Decision History 6–10)

## Goal

Ship **full parity** `@xerena/native` — all 42 web components with the same
public API, natively implemented (StyleSheet + tokens), tests green, docs
updated (docs are Phase 6 acceptance; release is a Phase 7 gate).

## Process (established in prior phases)

- Controller breaks the phase into tasks; each task = brief → implementer
  (coder-kimi or coder-hy3 — BOTH run `tencent/kimi-k2.7-code` now) → review
  (deepseek `reviewer`) → ledger note. Complex tasks split between the two
  coding agents.
- Whole-phase: dispatch `architect` (deepseek) to review spec+plan before any
  coding agent is assigned. (DONE — see Decision History.)
- Gates per task: `nx run-many -t test typecheck lint --projects=react-native`
  + `nx run react-native:build`. Root suites stay green
  (tokens, react, native, brand, styling).
- Commits: `git -c user.name="Xerena" -c user.email="xerena@local" commit`,
  English-only. `dist/` + `.superpowers/` gitignored.
- Ledger: `.superpowers/sdd/2026-09-15-xerena-native/progress.md`.

## Dependency-ordered tasks

### Task 1 — Native foundation (styles, hooks, primitives, Provider) ⭐ critical path
All later tasks depend on this. Everything in this task ships with tests.
- `styles/palette.ts` — resolve light/dark palette + `Partial<Record<SemanticAlias,string>>` overrides (`XTheme.semantic`).
- `styles/elevation.ts` — `nativeElevation(level)` parser (EXACT shadow grammar, see spec Decision 4).
- `styles/spacing.ts`, `styles/typography.ts` — raw token → style helpers.
- `hooks/useControllableState.ts`, `hooks/useReducedMotion.ts`,
  `hooks/usePressable.ts`, `hooks/useNativeMotion.ts`, `hooks/useNativeColors.ts`,
  `hooks/useDismissable.ts`, `hooks/useThemeMode.ts`.
- `primitives/Pressable.tsx`, `primitives/Overlay.tsx`, `primitives/Anchor.tsx`,
  `primitives/ListOverlay.tsx` (shared option-list primitive — THIRD-PARTY-BLAST-RADIUS: Select/Combobox/Menu depend on it).
- `Provider.tsx` rewrite: `theme: XTheme` REQUIRED (web-verbatim; drop `initialMode`),
  context = `{ theme, setTheme, semantic }` (web `ThemeContextValue` parity);
  `useTheme()` returns full context; `useNativeColors()` + `useThemeMode()` helpers;
  promote `XTheme`/`ColorMode`/`ThemeContextValue` types to the native package (exported, aligned with `@xerena/tokens` `SemanticAlias`).
- ESLint: extend `no-restricted-imports` to block `@xerena/react`, `@xerena/styling`, `react-dom`.
- `index.ts` exports updated (no react-native-package changes; builder-bob untouched).
- Commits as 1–3 scoped commits.

**Assignee:** one coding agent (both foundational + high blast radius — pick
kimi-k2.7-code for long-horizon carefulness). Reviewer afterwards.

### Task 2 — Actions (4): Button, IconButton, Link, ButtonGroup
Pressable base + token variant/size maps; loading/busy; ButtonGroup selection
context. Tests per component.

### Task 3 — Typography (6): Text, Heading, Badge, Divider, Skeleton, Kbd
Text styled from `typography.*`; Skeleton Animated pulse (reduced→static).

### Task 4 — Layout (3): Container, Stack, Grid
flexbox Views, token spacing.

### Task 5 — Form base (7): Field, Input, Textarea, Select, Checkbox, Radio, Switch
Field wiring via context; Select→modal list; Checkbox/Radio/Switch custom
Pressable. TextInput keyboard props.

### Task 6 — Form advanced (6): Slider, Combobox, RadioGroup, CheckboxGroup, InputGroup, NumberInput
Slider PanResponder; Combobox filter+overlay list; groups context wiring.

### Task 7 — Surfaces (2): Card, Avatar

### Task 8 — Data display (2): Table (toolkit), Pagination
View grid + scroll container; TableCheckbox/RowActions/expandable/EditableCell.

### Task 9 — Feedback (8): Spinner, Progress, Message, Tooltip, Toast, Dialog, Drawer, Popover
Overlay/Modal based; drawer slide; toast timers; progress bar/circle/page;
mouse variant web-only exemption. **Complex — split among both coders if
efficient (e.g. stateless Spinner/Progress/Message to one, overlay set to
other).**

### Task 10 — Navigation (4): Tabs, Accordion, Menu, Breadcrumb
Tabs indicator Animated; Accordion height reveal; Menu anchored list.

### Task 11 — Native docs (Phase 6) — release deferred to Phase 7
Write `guide/native.md` matrix (all 42 components × API summary, native
approach, divergence notes incl. `asChild` exemptions + palette-vs-CSS-var
values) + web-doc "React Native" divergence notes + sidebar native group.
**NO changeset/no release in Phase 6.** Release = Phase 7 gate
(`@xerena/native` 0.0.0→0.1.0 changeset → workflow run → published).

## Sequencing & parallelization

1. Task 1 first, alone (unblocks everything).
2. Tasks 2–4 and 7 (stateless-ish) can run in parallel after Task 1 —
   batch across coder-kimi + coder-hy3.
3. Tasks 5–6 (form) and 9–10 (overlays/nav) after foundations settle;
   Task 9 split.
4. Task 8 (Table toolkit) — largest single component; own slot.
5. Task 11 (docs, `guide/native.md`) completes phase; whole-phase review →
   Phase 7 release gate.

## Gates & acceptance

- `nx run-many -t test typecheck lint --projects=react-native` green with per-
  component tests covering: defaults, all variants, states, dark mode, reduced
  motion, overlay open/close/dismiss, controlled/uncontrolled.
- `nx run react-native:build` green (builder-bob lib output).
- Root suites green.
- No `@xerena/react`/`@xerena/styling`/`react-dom` imports anywhere in native src (enforced by eslint `no-restricted-imports` — actual rule, not Nx).
- Docs updated (`guide/native.md`). Release (`@xerena/native@0.1.0`) = Phase 7, NOT Phase 6 acceptance.

## Risks

- RN test env: Animated under fake timers, `measureInWindow` not implemented
  in jest — Anchor/ListOverlay tests `jest.spyOn` trigger-ref `measureInWindow`
  (or `UIManager.measureInWindow`) + `fireEvent(el, 'layout')` for fixed geometry.
- Overlay anchoring in RN is coordinate-based; media/rotation edge cases
  documented, not solved (parity = behavior intent).
- Pantone/playwright equivalents don't exist for RN — visual parity held by
  token-driven styles + unit tests, not screenshot gates.
- `useTheme()` shape change (XTheme → ThemeContextValue) is breaking for the
  skeleton's only consumer; the Provider test is updated in Task 1 — verify
  no other internal consumers exist (grep `useTheme`/`ThemeContext` in native).