# Xerena UI

Cross-platform design system for React and React Native.

- `@xerena/tokens` — design tokens (single source of truth)
- `@xerena/react` — web components (CSS variables / Vite)
- `@xerena/native` — React Native components (StyleSheet / builder-bob)

## Development

See `docs/superpowers/specs/2026-09-11-xerena-ui-design.md` for the architecture.

## Commands

```bash
nx run-many -t typecheck lint test build   # full check
nx test react                               # web tests
nx test tokens                              # token tests
nx dev storybook                            # component explorer (port 6006)
nx dev docs                                 # docs site
pnpm changeset                              # record changes for release
```
