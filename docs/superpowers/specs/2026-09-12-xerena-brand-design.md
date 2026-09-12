# Xerena — Brand Design (Phase 2)

**Date:** 2026-09-12
**Status:** Approved in design discussion (sections 1–3), pending written-spec review
**Predecessor spec:** `docs/superpowers/specs/2026-09-11-xerena-ui-design.md` (foundation)
**Depends on:** `@xerena/tokens`, `@xerena/react`, `apps/storybook`, `apps/docs` (foundation)

## Context

Xerena came from the name first. Original intent: **borderless/frameless UI** with **clean elevation** for modern **admin, dashboards, and AI chat/agent** products, differentiated by **smooth motion** (GSAP or custom animation libraries).

The name decomposes as "X" (the unknown / forward) × "serene" (calm). This yields the brand story:

> **Xerena, the calm center of complex systems.**

The messiest product surface (dense admin, streaming agent output) is exactly where a serene, precise surface has the most value.

## Brand Principles

1. **Borderless first.** Depth comes from tonal separation and soft elevation — never from visible borders. Borders, when they must exist, are last resort.
2. **Warmth as intelligence.** A warm accent (ember copper) carries energy on cool-warm neutral surfaces. Human, not cold; precise, not decorative.
3. **Editorial calm.** Typography leads (Fraunces + Instrument Sans). Generous whitespace, considered type scale, restrained decoration.
4. **Motion is identity.** Smooth, controllable motion is a brand promise, not a garnish. This phase locks the *principle*; motion tokens arrive in the next phase.
5. **Elevation speaks, borders stay silent.** Elevation tokens carry hierarchy; borders are de-emphasized globally.

## Voice

Four adjectives: **serene, precise, warm, forward.**

Copy tone: calm, confident, never shouty. Technical, accessible. UI copy should be short, present-tense, imperative-free where possible.

## Art Direction Summary

- Direction: **Warm Craft / editorial** (user-selected over serene-intelligence / nocturne / prism).
- Surface language: warm ivory field, deep warm ink text, ember copper accent.
- Distinctiveness: deliberately avoids the default "AI purple/blue"; warm craft reads human and is rare in agent/dashboard products.

## Logo System

### Wordmark

- The word “Xerena” is set in **Fraunces** (the system display family) — no separate display alphabet. Rationale: the commercial “Alkaline” script (Fort Foundry, 2021) is (a) not openly licensed, so unusable in a public repo, and (b) retro-retro-playful, which fights the serene positioning. Fraunces keeps one family across wordmark and system.
- Preferred rendering: medium weight, tight tracking, small-caps/italic alternative available for expressive contexts.

### Mark (X — hexagon)

- Small glyph: an **X** inside a **hexagonal silhouette**.
- **Not flat**: dimensional treatment, not flat vector:
  - Background: subtle vertical gradient.
  - X strokes: ember → copper gradient with a top inner highlight.
  - Soft drop shadow (from the elevation language) so the mark lifts off the surface.
- Props/components: `XerenaMark` (size `sm | md | lg`, tone `default | onDark`), `XerenaWordmark`, `XerenaLockup` (variant `horizontal | stacked`).
- Mark works from favicon (16px) to og-image (large); geometry must read at both extremes.

## Typography

| Role | Family | Usage |
|---|---|---|
| Display | **Fraunces** (variable, 400–600 + italic) | Wordmark, headings/display scale |
| Body | **Instrument Sans** (400/500) | UI body, labels |
| Mono | **Geist Mono** | Code, data, numerics (tabular) |

- Self-hosted via `@font-face` (public-repo safe licenses: Fraunces + Instrument Sans are OFL, Geist Mono is OFL; all redistributable).
- Font loading is a concern of the consuming app (VitePress loads its own; Storybook preview and tokens provide only the declarations as CSS vars in `tokens.css`).

### Type scale (tokens, in `typography.ts`)

- **Display** (Fraunces): `xs 24/32 w500`, `sm 30/38 w500`, `md 38/46 w500`, `lg 48/56 w600`, `xl 60/68 w600`; tracking `-0.01em` to `-0.02em` (tightens at larger sizes).
- **Body** (Instrument Sans): `sm 14/20`, `md 16/24`, `lg 18/28`.
- **Mono** (Geist Mono): `sm 13/20`, `md 14/22`, `lg 16/24`; tabular numerals enabled for data.

## Color

### Primitive scale

Replace the Tailwind placeholder palette from the foundation phase:

| key | ramp | values |
|---|---|---|
| `color.ember` (flat key) | 50/100/500/600/700/900 | 50 `#fdf1e9`, 100 `#f9e0cd`, 500 `#d97b45`, 600 `#c04e1d`, 700 `#9c3a13`, 900 `#52200c` |
| `color.sand` (renamed from `gray`) | 50/100/500/600/700/900 | 50 `#faf7f2`, 100 `#f4efe6`, 500 `#9a8f7e`, 600 `#7c7263`, 700 `#5a5245`, 900 `#2b2620` |
| `color.blue` | removed | placeholder; not part of the brand |

`ColorShade` stays `50|100|500|600|700|900`; the flat map `color.ember` + `color.sand` keeps `ColorName = 'ember' | 'sand'` and the existing `Record<ColorName, Record<ColorShade, string>>` typing intact (no nesting under a `brand` group).

### Semantic aliases

| alias | value |
|---|---|
| `primary` | `color.ember.600` |
| `primaryHover` | `color.ember.700` |
| `background` | `sand.50` |
| `surface` | `sand.100` |
| `text` | `sand.900` |
| `textMuted` | `sand.500` |
| `border` | `sand.100` |

Note: `border` is retained for compatibility but components should prefer elevation (principle 1). Status/semantic colors (success/warning/danger/info) are deferred — they are a styling-phase concern, not brand identity.

## Elevation (new)

Borderless soft shadows; layered ambient + directional; large blur, minimal spread; shadow color derived from ink (`sand.900`) at low alpha.

- `none` — none
- `xs` — `0 1px 2px rgba(43,38,32,0.04), 0 2px 4px rgba(43,38,32,0.04)`
- `sm` — `0 2px 6px -1px rgba(43,38,32,0.06), 0 4px 12px -2px rgba(43,38,32,0.06)`
- `md` — `0 4px 12px -2px rgba(43,38,32,0.08), 0 10px 28px -6px rgba(43,38,32,0.10)`
- `lg` — `0 8px 24px -4px rgba(43,38,32,0.10), 0 18px 48px -12px rgba(43,38,32,0.14)`

Semantic: `raised` = `md`, `overlay` = `lg`.

## Radius (new)

`none(0) · sm(4) · md(8) · lg(12) · xl(20) · 2xl(28) · 3xl(36) · 4xl(44) · full(9999)`.

- 2xl–4xl are for large cards/panels/immersive surfaces (user-requested extension to the scale).
- `full` is reserved for small elements (badges, avatars); large-radius pills are avoided for surfaces.

## Motion (principle only, this phase)

- Motion tokens (duration, easing, principles) are the **next** phase.
- This phase records the promise: all motion is smooth, interruptible, and earned (see principle 4). No animation implementation ships here.

## `@xerena/brand` Package (new)

- Location: `packages/brand` (mirrors `packages/react` build: Vite, TypeScript, tuple 3.0 test).
- **Not** dependent on `@xerena/react` — brand assets are static identity; the component system is separate.
- Depends on `@xerena/tokens` (ember hex for gradients, `fontFamily.display` for the wordmark) — single source of truth.
- Exports:
  `XerenaMark`, `XerenaWordmark`, `XerenaLockup` (React components) + raw SVGs (`mark.svg`, `lockup.svg`, favicon + og-1680×945).
- Components: size (`sm|md|lg`), tone (`default|onDark`), accessibility (`aria-label`, mark+wordmark roles), `title` passthrough.
- Tests (Vitest + jest-dom), lint, typecheck, build — same quality bar as existing packages.

## Storybook & Docs

- **Storybook**: preview background → `sand.50`; fonts (Fraunces / Instrument Sans / Geist Mono) loaded via Google Fonts CDN; favicon tab → `XerenaMark` (`managerHead`); showcase page **“Brand — Xerena identity”** (mark tryout across sizes/tones, palette swatches, type specimen).
- **Docs (VitePress)**: new *Brand* page — DNA story, principles, voice, token tables, usage of mark/lockup; config head loads the same fonts; docs favicon → mark SVG.

## Testing & CI

- No CI changes required (monorepo scan picks up `brand`).
- Nx graph: `storybook:build` builds `brand` via existing `dependsOn:["^build"]`; `brand` depends on `tokens`.
- Existing tests referencing `color.blue`/`color.gray` updated to `ember`/`sand`.

## Non-Goals (this phase)

- No concrete component system work (that is the Styling-composition phase after Motion).
- No dark-mode token set.
- No icon library, no full status color system.
- No `@font-face` file bundling in `@xerena/tokens` (loading is app-level; tokens expose family names + CSS vars only).

## Deliverables Checklist

- [ ] Spec (this document) committed
- [ ] `@xerena/tokens` — `ember`, `sand` (rename from `gray`), `typography`, `elevation`, `radius`; `tokens.css` re-emitted; tests updated
- [ ] `@xerena/brand` package scaffolded (`nx g` + project.json wiring), components + raw SVGs, tests/lint/typecheck/build green
- [ ] Storybook preview theming + Brand showcase page
- [ ] Docs Brand page
- [ ] Full pipeline green (`nx run-many -t typecheck,lint,test,build`)