# Xerena — Web Components (Phase 5)

- **Date:** 2026-09-13
- **Status:** Approved in design discussion (brainstorming lengkap, 6 section arsitektur + 9 kategori komponen)
- **Predecessor spec:** `docs/superpowers/specs/2026-09-12-xerena-styling-design.md` (Phase 4)
- **Depends on:** `@xerena/tokens` (foundation + brand + motion), `@xerena/styling`, `apps/docs`, `apps/storybook`
- **Makes available to:** Phase 6 (Native Components), Phase 7 (Release)

## Context

Fase 4 menyerahkan lapisan ergonomis antara design tokens dan komponen: utility
generator (`xr-*` classes), style helper resolvers, dan motion hooks/web
motion. Spec Phase 4 menjanjikan: *"Semantic colors — `--xr-semantic-*` CSS vars
+ semantic utility classes → Phase 5 (components + theming). `@xerena/react` akan
juga depend pada `styling/react` (useMotion hooks)."*

Fase ini (Components) mengirim **sistem komponen web lengkap** di
`@xerena/react` — 42 komponen yang di-brainstorm satu per satu — plus perluasan
tokens (status + dark palette), generator semantik, theming runtime, primitif
headless internal, dan rilis versi di akhir fase.

Ini adalah **fase komponen**: `@xerena/react` menjadi library penuh.
`@xerena/react-native` menerima **tanpa perubahan** (Phase 6).

## Package Architecture & Boundaries

### Dependency graph setelah Phase 5

```
@xerena/tokens (primitive + semantic + status + dark)
   └─→ @xerena/styling (generator + css helpers + hooks)
          ├─→ styles.css: xr-* utilities + semantic + dark-aware vars
          ├─→ @xerena/react (42 komponen)
          │       ├─ primitives/: Slot/asChild, cn, useClassName, useVariant
          │       ├─ hooks/: headless state machines (build sendiri)
          │       ├─ components/<Category>/<Name>/: komponen + test + variants
          │       └─ styles: import tokens.css + styles.css
          └─→ docs + storybook (konsumen)
```

### Aturan (ditegakkan via ESLint `no-restricted-imports` + Nx constraints)

- `@xerena/react`: hanya `tokens`, `styling` (. + ./react), `react`, `react-dom`,
  `react-dom/client`. **Tanpa runtime library UI pihak ketiga** (Radix, Base UI,
  etc.) — primitif headless dibangun sendiri, diinformasikan oleh riset atas
  API mereka. Null dependency penuh dipertahankan.
- `@xerena/react` TIDAK boleh mengimpor `@xerena/react-native` (runtime atau type).
- `@xerena/styling` tetap non-mutasi dari komponen: tidak ada kepemilikan balik.
- `react` `^19.0.0` peer dependency.

## Keputusan Desain Arsitektur (dikunci di brainstorming)

1. **Konsumsi styling** — komponen merender class `xr-*` dari `styles.css`
   sebagai sumber utama. `cssVar`/`css` (Phase 4) hanya untuk nilai dinamis
   (animasi/override). Provider memuat `tokens.css` + `styles.css`.
2. **Theming** — CSS var runtime di Provider: `Provider({ theme, toneOverrides? })`
   → `useMemo` menghasilkan CSS var override di theme scope. Dark = scope
   selector `[data-xerena-theme='dark']`. Komponen tidak pernah tahu tema —
   semua membaca var.
3. **Varian API** — `asChild`/composition à la Radix. Props union literal untuk
   varian sederhana; komponen kompleks (Menu, Combobox, Dialog, Tabs,
   Accordion, RadioGroup, Field) memakai composition kepala-parts + context.
4. **Micro-motion** — satu inti motion (useMotion/useReducedMotion dari Phase 4)
   + transition map per komponen. Motion = umpan balik fisik (hover/active/
   focus-visible/press/enter/exit), bukan koreografi dekoratif.
5. **Struktur dokumentasi** — satu spec utuh (dokumen ini): arsitektur →
   per-kategori detail 42 komponen. Plan dipecah banyak task.

## Status & Dark Palette (perluasan `@xerena/tokens`)

### Primitive colors — status scale

4 keluarga baru, bentuk konsisten `value.shade` (50–900) seperti ember/sand:

- `success` (hijau kontras aman)
- `warning` (amber)
- `danger` (merah)
- `info` (biru)

`colors` **tetap light-only** (tanpa objek `{light,dark}`) — dark value hidup
HANYA di `semantic` (keputusan brainstorming); menghindari ambiguitas
"warna apa ini" dan menjaga contrast math primitif.

### Semantic aliases — dua mode

Perluasan `semantic/index.ts`:

```
semantic.light / semantic.dark  (setiap alias → nilai primitive light/dark)
```

Alias light (dari palette yang ada):
`primary` (ember.600), `primaryHover` (ember.700), `primaryActive` (ember.900),
`background` (sand.50), `surface` (sand.100), `surfaceHover` (sand.100 →
tinted via primary alpha), `border` (sand.100), `borderStrong` (sand.500),
`text` (sand.900), `textMuted` (sand.500), `textOnStrong` (light),
`successtext`/`warningtext`/`dangertext`/`infotext` (shade gelap keluarga status
untuk kontras pada latar terang),
`successSurface`/`warningSurface`/`dangerSurface`/`infoSurface` (latar soft),
`danger`/`dangerHover`, `info`/`infoHover`.

Alias dark memetakan ke palette dark yang sesuai (background terang → gelap,
text terang, primary tetap ember-tinted lebih terang untuk aksesibilitas pada
latar gelap). Nilai eksak ditentukan saat implementasi generator — prinsip:
**kontras minimal 4.5:1 untuk teks, 3:1 untuk non-teks** (WCAG AA).

`semantic.spacing` tetap (xs–xl) — tidak berubah.

### Generator `@xerena/styling` (perluasan backward-compatible)

Output `dist/styles.css` baru:

```
:root { --xr-* primitive (existing) + --xr-semantic-* light }
[data-xerena-theme='dark'] { --xr-semantic-* dark }
```

Kelas semantik konsumen (bukan per-shade; membaca var sehingga ikut tema
otomatis): `xr-bg-primary`, `xr-bg-primary-hover`, `xr-text-muted`,
`xr-text-danger`, `xr-border-danger`, `xr-text-success`, `xr-bg-success-soft`,
dst. — pola `<utility>-<semantic-alias>` yang diekspand untuk seluruh semantic.

Sumber: `tokens.json` + `semantic/index.ts` (via `resolveTokensPath` yang sudah
ada). Tetap deterministik, tanpa DOM, `require.resolve` yang sama.

## Provider & Theming

### `Provider` (luas API)

```ts
interface ProviderProps {
  children: ReactNode
  theme: XTheme            // XTheme diperluas: { mode, semantic?: DeepPartial<SemanticColors> }
  initialMode?             // deprecated → theme.mode
  toneOverrides?: partial  // alias → nilai hex/var override
}
```

- Scope DOM: `[data-xerena-theme='light'|'dark']` (sudah ada).
- `useMemo` menghasilkan `--xr-semantic-*` override string untuk scope aktif.
- Mode disimpan state; persistence (localStorage/`<html>`) TIDAK di tangani —
  pola didokumentasikan di docs (tanggungan aplikasi).
- Import CSS: `@xerena/react/styles.css` (atau manual `tokens.css`+`styles.css`)
  — satu jalur pakai.
- `useTheme` returns `{ mode, semantic }` (diperluas).

## Primitif Headless (dibangun sendiri)

Tiga lapis, semua di `packages/react/src`:

### Lapis 1 — Deformasi & styling

- `Slot` + `asChild`: anak menggantikan elemen render, props di-merge
  (gaya Radix, tanpa library). Satu subtle perilaku: event/aria/styling
  di-forward + di-merge ke anak.
- `cn` (class merger, util internal) + `useClassName(...variants)`.
- `useVariant`, `useSize`: mapping props → class `xr-*` dari `variants.ts`.
- `styles.css` re-export — `import '@xerena/react/styles.css'`.

### Lapis 2 — Hooks headless (state machine tanpa DOM)

- `useControllableState(value, defaultValue, onChange)`.
- `useFocusRing`, `useDisabled`, `usePress` (`:active`/`:disabled`),
  `useFocusTrap` (Dialog/Drawer), `useDismissable` (Popover/Menu), `useFlushSync`.
- `useRovingFocus` (Tabs/RadioGroup/Dialog-close, toolbars).
- `useReducedMotionSync` — satu titik: gabung `useReducedMotion` + transition map
  → komponen tidak logika sendiri.
- `useMediaQuery` (dapat digabung ke useMotion untuk UX responsive).

### Lapis 3 — Composition primitives (kepala-parts)

- `Menu`, `Combobox`, `Dialog`, `Tabs`, `Accordion`, `RadioGroup/CheckboxGroup`,
  `Field`, `Popover` — masing-masing Root/Trigger|.../Content dengan context
  provider internal.
- `OverlayPrimitive` internal: portal + focus-trap + dismiss-aware — SATU
  implementasi dipakai Dialog/Drawer/Popover/PreviewPopover.
- `PreviewPopover` internal ringan (untuk Tooltip/Pagination preview).
- **Tanpa** `Provider` tingkat state global selain React context lokal per komponen.

## Sistem Micro-Motion (aturan shared — dikunci)

1. **Reduced-motion selalu dibormati** — `useReducedMotion()`/snap-to-instant dari
   Phase 4 menangani; komponen TIDAK menulis logika sendiri.
2. **Micro-motion hanya umpan balik fisik** — hover/active/focus-visible/press/
   enter/exit. Bukan koreografi dekoratif.
3. **Semua nilai dari tokens** (`motion.duration`, `motion.easing`) — tanpa magic
   number.
4. **Transisi default ringan**: ≤150ms total per interaksi (sistem normal).
5. **Dismissible/popup** (Dialog, Menu, Popover, Toast, Drawer): enter/exit
   animation — duration `moderate`/`emphatic`, easing `enter`/`exit`.
6. **`animated` variant** (mis. Button): boost press scale/shadow — jelas, tetap
   reduced-safe.

Tiap komponen di bawah memiliki tabel **Motion** — event → property →
duration → easing → reduced fallback.

## Komponen — 42, per kategori

### Actions (4)

#### Button
| Aspek | Spesifikasi |
|---|---|
| Varian | `primary`(solid) · `ghost`(transparent) · `outline`(border+text-primary) · `soft`(tinted bg) · `destructive`(danger solid) · `link`(text-only) |
| Size | `sm`(h-8) · `md`(h-10) · `lg`(h-12) |
| States | default · hover · active(press) · focus-visible(ring) · disabled · loading(aria-busy) |
| Motion | hover `fast`/`enter` translateY(-1px)+bg tint · active `instant`/`exit` scale(0.98) · focus ring `fast` · `animated`: press scale(0.96)+shadow |
| A11y | native `<button>`, focus ring, `aria-busy`, `type="button"` default |
| API | `asChild`, `loading`, `leftIcon/rightIcon`, `fullWidth`, `variant`, `size` |

#### IconButton
Same 5 varian (minus link) + sizes sm/md/lg. **`aria-label` wajib**. Tooltip
opsional. Motion: hover tint `fast`/`enter`, active scale(0.94).

#### Link
`variant`: `default`(text-primary underline-hover) · `muted` · `animated`
(underline slide-in). `asChild` esensial. `target/rel` passthrough,
`aria-current`. Motion: underline `fast`/`enter`.

#### ButtonGroup
Orientation (`horizontal`/`vertical`), `spacing` size, `value`+`onValueChange`
optional (selection). No own motion. A11y: group roles sesuai konteks.

### Typography (6)

#### Text
`variant`: `body` · `muted` · `strong` · `error`(danger). `size`: `sm/md/lg`
(→ `typography.body.*`), family `body`/`mono`. `as`, `asChild`, `truncate`,
`center`. No motion. A11y via `as`.

#### Heading
`as` `h1–h6`; mapping visual `typography.display.xs→xl`. `asChild`. No motion.
Satu `h1` per view (doc pattern).

#### Badge
`tone`: `neutral` · `info` · `success` · `warning` · `danger` · `brand` —
soft bg + kontras text via `--xr-semantic-*`. Sizes `sm/md`, radius `full`.
No motion. `aria-label` bila icon-only.

#### Divider
`orientation` `horizontal`/`vertical`, `variant` `solid`/`dashed`,
`label`(opsional "or"). A11y: `role="separator"`, `aria-orientation`.

#### Skeleton
`shape`: `line`/`circle`/`rect`/`text`. `width/height`. Motion: pulse `base`
loop (non-reduced); static fallback. A11y: `aria-hidden` + container
`role="status"`/`aria-busy`.

#### Kbd
Family mono, border+radius sm, text muted. `<kbd>` native. No motion.

### Layout (3)

#### Container
`variant`: `centered` · `fluid` · `narrow`. `size`: `sm/md/lg/xl` → max-width
(640/768/1024/1280). No motion, no a11y semantic (>div).

#### Stack
`orientation` h/v/inline, `spacing` (gap `--xr-spacing-*`), `alignItems`,
`justifyContent`, `wrap`. `as`. No motion.

#### Grid
`variant`: `auto`(auto-fit) · `explicit`. `columns`(1–12), `gap`. `as`. No motion.

### Form dasar (7)

Prinsip bersama: semua field pakai `Field`; error → border/teks danger,
`aria-invalid`+`aria-describedby`; disabled/readOnly native; layout `h-10` md,
radius `sm`, fokus ring `primary`; motion fokus `fast`/`enter`; error TIDAK
bergoyang/bergetar.

#### Field
`label`, `hint`, `error`, `required`(asterisk+aria), `asChild`. Auto `htmlFor`/
`id`/`aria-describedby`. No motion.

#### Input
`variant`: `outlined`(default) · `filled`. Type passthrough. Addon → InputGroup.

#### Textarea
Seperti Input + `rows`, `resize`(`none`/`auto`), `autoSize` optional.

#### Select (native)
Native `<select>`+`<option>`, `multiple`, `placeholder`. Motion: chevron
`instant` rotate saat open. A11y: native select (role implied), `aria-invalid`.

#### Checkbox
Varian: `default`, `mixed`(indeterminate). `checked`/`onCheckedChange`,
uncontrolled. Motion: ✓ fill `instant` + pop `fast`/`enter`. A11y:
`role="checkbox"`, `aria-checked`, native hidden input.

#### Radio
Sama konsep; group via `RadioGroup`. Motion: dot pop `fast` saat pilih.

#### Switch
`checked`/`onCheckedChange`, sizes sm/md. Motion: thumb translate
(×27 sm / ×32 md) `base`/`enter`, bg change `base`; reduced → instant.
A11y: `role="switch"`, `aria-checked`, native checkbox input.

### Form lanjutan (6)

#### Slider
`variant`: `single` · `range`. min/max/step, orientation h/v. Motion: thumb
drag `base`/`enter`, release settle `base`/`enter`. A11y: `role="slider"`,
`aria-valuemin/max/now/text`, arrow keys.

#### Combobox
**Struktur**: `Combobox`(Root) · `Input` · `List` · `Option` · Clear.
Varian: `default`(popover) · `inline`. State: search, open/close, keyboard nav
(aria-activedescendant), active/selected, loading(opt), empty state.
Motion: list fade+slide `fast`/`enter`; option highlight bg tint `fast`.
A11y: `role="combobox"` + `aria-expanded/controls/activedescendant`, listbox,
escape/blur close, focus return.

#### RadioGroup
Binding value context + layout orientation. A11y: `role="radiogroup"`,
`aria-labelledby`. No motion sendiri.

#### CheckboxGroup
Sama untuk Checkbox. n:1 wiring.

#### InputGroup
Compose Control + addon (icon/button/text/Select). Variant `outlined/filled`.
Fokus ring menyatu.

#### NumberInput (Stepper)
Varian `default`(+/−) · `compact`. min/max/step, format(Intl opt).
Motion: press `instant`/scale(0.94). A11y: `role="spinbutton"`,
`aria-valuenow/min/max`, up/down keys.

### Surfaces (2)

#### Card
`variant`: `outlined`(default) · `elevated` · `soft` · `interactive` · `flat`.
`padding` sm/md/lg, `radius` md default. Motion: `interactive` hover
translateY(-2px)+shadow `base`/`enter`, focus ring `fast`.
A11y: `as`/`asChild` untuk semantik.

#### Avatar
`variant`: `image` · `initials` · `icon`. Sizes sm/md/lg/xl. Morph
`square`/`circle`. `onClick` → ring+fokus. Tanpa AvatarGroup (Phase 5);
`stacked` opt.

### Data display (2)

#### Table (toolkit)
Struktur: `Table`(Root, context) · `Head` · `Body` · `Row` · `Cell`
(th+scope passthrough). Fitur:

- `variant`: `striped` · `outlined` · `grid` · `hover`; `size` sm/md/lg.
- `frozenHeader` — sticky thead (scroll container `maxHeight`).
- **Checklist**: `TableCheckbox` header (select-all, tri-state) + per-baris;
  `selection` controlled (`selectedRowKeys`/`onSelectionChange`) atau
  uncontrolled; `aria-selected`.
- **Sub-table**: `Row expandable` → `expandContent`; chevron toggle,
  expanded controlled/uncontrolled. Motion: height reveal `moderate`/`enter`,
  collapse reverse (reduced → instant). A11y: `aria-expanded`, `aria-controls`.
- **Edit table**: `EditableCell` — text → editor (`Input`/`Select`/`NumberInput`),
  Enter save, Esc cancel, blur=save opt. `onCellChange(rowId, colId, value)`.
  A11y: cell `aria-label`, focus management.
- **Row actions bar**: `RowActions` — positioning `actionsPosition` `left`/`right`
  (default right); col sticky opt; header-cell placeholder. A11y: header cell
  dengan aria.
- **Search/filter**: `TableSearch` — input toolbar (custom `filterFn` default
  prefix case-insensitive; `onSearchChange` controlled untuk server-side);
  `noResults` state. Tidak auto-disable seleksi.

Semua opsional — Table dasar tetap ringan tanpa fitur.

#### Pagination (dengan preview)
`variant`: `page` · `simple`(prev/next+info). `totalPages` computed,
`pageSize`/`total`/current, `siblingPageCount`(1 default).
**Preview hover/focus**: `renderPagePreview(page)` → mini popover 3 baris
pertama/ringkasan; lazy (hanya saat hover/focus); `aria-describedby` ke preview
id; tidak steal focus; click tetap langsung nav. Motion: popover masuk
`fast`/`enter`, keluar `moderate`/`exit` (reduced instant). A11y:
`role="navigation"`+aria-label, `aria-current="page"`.
Memakai primitif `PreviewPopover`.

### Feedback (8)

#### Spinner
Sizes sm/md/lg, `color` currentColor. CSS rotate loop (`animation` di
styles.css, `prefers-reduced-motion` slow/instant — spinner = indikator, bukan
dekorasi). A11y: `role="status"` + `aria-label`/visually-hidden "Loading…",
container `aria-busy`.

#### Progress (multimodal)
`variant`: `bar`(default determinate/indeterminate) · `pageTop` ·
`pageBottom` (fixed viewport, z-index overlay — progress halaman/section) ·
`mouse` (ring kecil **mengikuti kursor**, fill sesuai progress; teks % opt;
reduced → ring statis tetap ikut kursor, fill tanpa animasi) · `circle`
(ring statis, `size`/`stroke`).
Motion: value transition `base`/`enter`; `mouse` fill sama, posisi kursor
langsung (no lerp); reduced → all instant/statis.
A11y: `role="progressbar"`, aria-valuenow; pageTop/Bottom menjaga info off-
screen; `mouse` + `aria-hidden` visual, nilai via aria.

#### Message / Alert
`tone`: `neutral` · `info` · `success` · `warning` · `danger`.
Icon+title+description+close(opt). `position` dalam container:
`top-left/top-center/top-right/bottom-left/bottom-center/bottom-right`
(default `bottom-center`).
Motion: masuk `fast`/`enter` fade+slight slide; exit bila dismiss.
A11y: `role="alert"` / live region.

#### Tooltip
Trigger hover/focus. Multiple: delay masuk 400 (mouse) / 0 (kb), exit 100.
`position` dengan **anchor corner**: `topStart`/`topCenter`/`topEnd`(+bottom)
— default `topCenter`. Posisi + flip. Memakai `PreviewPopover`.
Motion: fade+rise `fast`/`enter` (reduced instant). A11y: `role="tooltip"`
non-interactive, `aria-describedby`.

#### Toast
`variant`: success/danger/warning/info/neutral; `title`+`description`+
`action`+`onDismiss`; stack per-corner; `position`: 6 corner
(`top-left/top-center/top-right/bottom-left/bottom-center/bottom-right`);
auto-dismiss(4–6s, pause-on-hover).
Motion: masuk `moderate`/`enter` slide-up fade, keluar `emphatic`/`exit`
(reduced instant). A11y: `role="status"` / `role="alert"` untuk error, aria-live
polite.

#### Dialog
Struktur: Root/Portal/Overlay/Content/Close/Title/Description. Varian
`center` · `bottomSheet`. Focus trap, Esc close, aria-modal, labelled-by.
Motion: overlay fade `moderate`/`enter`; content scale-in(0.97→1)+fade
`moderate`/`enter`; close `fast`/`exit` (reduced instant). Stack: 2 max,
aria-hide bawah. Memakai `OverlayPrimitive`.

#### Drawer
Sides `left`/`right`(default)/`top`/`bottom`. Sizes xs/sm/md/lg. Struktur
seperti Dialog. Motion: slide-in `moderate`/`enter` dari sisi; overlay fade.
`OverlayPrimitive`.

#### Popover
Root/Trigger/Content(arrow). `trigger`: `click`/`hover`. Posisi+flip+boundary,
Esc/outside-click close, fokus mgmt. Motion: fade+scale `fast`/`enter`, exit
`moderate`/`exit`. `OverlayPrimitive`.

### Navigation (4)

#### Tabs
`Tabs`(Root) · `List` · `Trigger` · `Panel`. Varian `underline`(default) ·
`pill` · `enclosed`. Orientation h/v. States: default/hover/active/selected/
focus/disabled.
Motion: **underline indicator sliding antar tab** `moderate`/`enter` (bukan
cross-fade konten); reduced → switch instant.
A11y: `role="tablist"/tab/tabpanel`, `aria-selected/controls`, roving + arrows
(`useRovingFocus`), `aria-orientation`.

#### Accordion
`Accordion`(Root) · `Item` · `Header` · `Trigger` · `Content`. `type`:
`single`(default) · `multiple`.
Motion: content height reveal `moderate`/`enter`, collapse reverse; chevron
rotate `fast`; reduced instant.
A11y: `aria-expanded` (trigger), `aria-controls` (content), space/enter.

#### Menu / Dropdown
`Menu`(Root) · `Trigger` · `Content` · `Item` · `Separator` · `Label` ·
`SubMenu`(opt). Varian `default`(stacked) · `grid`(icon toolbar).
Motion: open `fast`/`enter` fade+scale, close `moderate`/`exit`, item hover
indicator `fast`; reduced instant.
A11y: `aria-haspopup`, keyboard (arrow + typeahead), focus return.
`OverlayPrimitive`-like dismiss.

#### Breadcrumb
`Breadcrumb` + `Item`(+`current`). `separator`: slash/chevron/dot.
A11y: `aria-label="Breadcrumb"`, `aria-current="page"`. No motion.

## Testing Strategy (per komponen)

Vitest + RTL + jsdom, colocated `*.test.tsx`:

- render default + setiap varian (table-driven; assert class `xr-*` tepat).
- states: disabled, loading, hover/active (bila ada), checked/selected, controlled
  vs uncontrolled.
- theming: override Provider → assert var (bukan hex).
- a11y: `getByRole`, aria assertions; `jest-axe` di render dasar tiap komponen.
- reduced-motion: mock `matchMedia` reduce → assert snap `'1ms'`.
- komponen overlay: portal, focus trap, esc/outside-click, focus return.

Existing suites tetap hijau (tokens, react, react-native, brand, styling).

## Storybook

- Folder mengikuti kategori: `Actions/Button/*.stories.tsx`, `Data/Table/…`.
- Jenis per komponen: Default + tiap varian + states + dark-mode +
  reduced-motion preview. A11y addon aktif.
- Decorator: `Provider` + `tokens.css` + `styles.css` (sudah ada; diperluas
  dark toggle toolbar).
- **Playwright test-runner** dipromosikan di Phase 5: interaksi dasar (open
  menu, toggle accordion, submit) sebagai visual regression gate.

## Dokumentasi (VitePress)

- Guide baru per komponen: `guide/components/<Category>/<Name>.md` —
  purpose, API table (props), variants table, motion behavior, asChild usage,
  a11y notes, contoh kode.
- Update getting-started: cara pakai komponen + Provider + styling import.
- Sidebar: sub-grup Components setelah Styling.

## Deferred (parked ke fase berikutnya)

- **Native komponen** (`@xerena/react-native`) → Phase 6 (API selaras type-only
  bila memungkinkan; tanpa runtime cross-import).
- **i18n / RTL layout** (tanpa infra; ltr default, rtl di CSS tombol/icon bila
  mudah).
- **Virtualisasi data** (Table besar, Combobox besar) — tidak build-in.
- **Drag & drop** — tidak ada komponen DnD.
- **DatePicker/TimePicker/Calendar** — tidak ada; `NumberInput`/`Combobox`/`Field`
  mencakup kebutuhan umum.
- **Theming persist** (localStorage/`<html>`) — tanggung jawab aplikasi;
  dokumentasi pola.
- **Motion choreography kompleks** (page transitions, spring 3D) — mikro-saja.

## Versioning & Release (di akhir Phase 5)

Setelah seluruh komponen + testing + docs hijau dan **review menyeluruh
disetujui**: semua package naik versi + changeset, dan rilis dilakukan (tag
`@xerena/*@x.y.z`) sebagai langkah akhir fase. Ini termasuk `@xerena/styling`
keluar dari `0.0.0`.

- Environment: sesuai fondasi (Node 22, pnpm 10, `NPM_TOKEN`).
- Quality gate merge: typecheck+lint+test+build hijau; changeset; stories;
  docs; minimal 1 approver.

## Riwayat Keputusan (brainstorming ringkas)

| # | Keputusan |
|---|---|
| 1 | Kit lengkap ~42 komponen; varian eksplisit per komponen |
| 2 | `asChild`/composition; headless dibangun sendiri (riset Radix/Base UI) |
| 3 | Konsumsi styling: class `xr-*` utama, `cssVar` untuk dinamis |
| 4 | Theming runtime: CSS var di Provider (theme + toneOverrides) |
| 5 | Micro-motion: inti useMotion + transition map per komponen; motion = feel ux premium |
| 6 | Satu spec utuh; plan dipecah banyak task |
| 7 | Perluas generator: emit `--xr-semantic-*` + kelas semantik |
| 8 | Status colors + dark palette ditambahkan ke tokens |
| 9 | Dark HANYA di semantic (colors tetap light-only) |
| 10 | Progress multimodal (bar/pageTop/pageBottom/mouse-ring/circle) |
| 11 | Tooltip/Message/Toast positioning corner |
| 12 | Table toolkit (checklist/sub-table/edit/frozen/row-actions/search+filter) |
| 13 | Pagination hover/focus preview popover |
| 14 | Bump + rilis di akhir fase (setelah review) |