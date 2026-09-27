import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'
import { PreviewIsland } from './components/PreviewIsland'

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    PreviewIsland,
    ...components,
  } satisfies MDXComponents
}
