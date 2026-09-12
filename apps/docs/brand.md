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
