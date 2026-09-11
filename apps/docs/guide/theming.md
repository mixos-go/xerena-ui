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
