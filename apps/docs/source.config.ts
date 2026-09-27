import { defineConfig, defineDocs } from 'fumadocs-mdx/config'
import { previewCodePlugin } from '@xerena/preview/mdx'

export const docs = defineDocs({
  dir: 'content/docs',
})

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [previewCodePlugin],
  },
})
