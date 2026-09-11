# Getting Started

## Install

```bash
pnpm add @xerena/tokens @xerena/react
```

## Web

```tsx
import { Provider } from '@xerena/react'
import '@xerena/react/styles/base.css'

export function App() {
  return <Provider>…</Provider>
}
```

## React Native

```bash
pnpm add @xerena/tokens @xerena/native
```

```tsx
import { Provider } from '@xerena/native'

export function App() {
  return <Provider>…</Provider>
}
```

> **Note:** The web and native packages share the same API; web uses CSS variables, native uses StyleSheet.