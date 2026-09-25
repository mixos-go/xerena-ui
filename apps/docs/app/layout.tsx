import type { ReactNode } from 'react'
import { RootProvider } from 'fumadocs-ui/provider/next'
import '@xerena/react/styles.css'
import '@xerena/preview/styles.css'
import './global.css'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider search={{ options: { type: 'static' } }}>{children}</RootProvider>
      </body>
    </html>
  )
}
