import type { ReactNode } from 'react'
import { RootProvider } from 'fumadocs-ui/provider/next'
// tailwind first: its @layer theme/base/components/utilities must be declared
// BEFORE xerena-components, otherwise preflight (base layer) beats .xr-*
// rules and components render unstyled (no radius/padding). CSS order follows
// import order, so xerena styles come last to sit on top of the layer stack.
import './global.css'
import '@xerena/react/styles.css'
import '@xerena/preview/styles.css'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider search={{ options: { type: 'static' } }}>{children}</RootProvider>
      </body>
    </html>
  )
}
