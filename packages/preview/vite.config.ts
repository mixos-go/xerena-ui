import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts({ entryRoot: 'src', rollupTypes: true })],
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        mdx: resolve(import.meta.dirname, 'src/mdx.ts'),
      },
      name: 'XerenaPreview',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        entryName === 'index' ? (format === 'es' ? 'index.js' : 'index.cjs') : `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ['react', 'react-dom', '@xerena/react', '@xerena/tokens', '@xerena/styling'],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
