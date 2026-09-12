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
