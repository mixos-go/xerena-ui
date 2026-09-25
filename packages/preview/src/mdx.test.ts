import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { describe, expect, test } from 'vitest'
import { previewCodePlugin } from './mdx'

function apply(source: string): unknown {
  const processor = unified().use(remarkParse).use(remarkMdx).use(previewCodePlugin)
  const tree = processor.parse(source)
  processor.runSync(tree, { value: source })
  return tree
}

function findPreview(tree: unknown): Array<Record<string, unknown>> {
  const found: Array<Record<string, unknown>> = []
  const visit = (node: unknown): void => {
    if (typeof node !== 'object' || node === null) return
    const record = node as Record<string, unknown>
    if (record['type'] === 'mdxJsxFlowElement' && record['name'] === 'Preview') found.push(record)
    const children = record['children']
    if (Array.isArray(children)) children.forEach(visit)
  }
  visit(tree)
  return found
}

function codeOf(node: Record<string, unknown>): unknown {
  const attributes = node['attributes']
  if (!Array.isArray(attributes)) return undefined
  for (const attribute of attributes) {
    if (typeof attribute === 'object' && attribute !== null) {
      const record = attribute as Record<string, unknown>
      if (record['type'] === 'mdxJsxAttribute' && record['name'] === 'code') return record['value']
    }
  }
  return undefined
}

describe('previewCodePlugin', () => {
  test('injects code from Preview children', () => {
    const tree = apply('<Preview title="Primary">\n  <Button variant="primary">Save</Button>\n</Preview>\n')
    const previews = findPreview(tree)
    expect(previews).toHaveLength(1)
    expect(codeOf(previews[0] as Record<string, unknown>)).toBe('<Button variant="primary">Save</Button>')
  })

  test('explicit code prop wins over injection', () => {
    const tree = apply('<Preview title="Primary" code="manual">\n  <Button>Save</Button>\n</Preview>\n')
    expect(codeOf(findPreview(tree)[0] as Record<string, unknown>)).toBe('manual')
  })

  test('leaves self-closing Preview untouched', () => {
    const tree = apply('<Preview title="Empty" />\n')
    expect(codeOf(findPreview(tree)[0] as Record<string, unknown>)).toBeUndefined()
  })

  test('handles nested JSX and multiple previews independently', () => {
    const tree = apply(
      '<Preview title="One">\n  <Card><Button>Go</Button></Card>\n</Preview>\n\n<Preview title="Two">\n  <Badge>New</Badge>\n</Preview>\n',
    )
    const previews = findPreview(tree)
    expect(previews).toHaveLength(2)
    expect(codeOf(previews[0] as Record<string, unknown>)).toBe('<Card><Button>Go</Button></Card>')
    expect(codeOf(previews[1] as Record<string, unknown>)).toBe('<Badge>New</Badge>')
  })

  test('ignores non-Preview elements', () => {
    const tree = apply('<Callout>\n  <Button>Save</Button>\n</Callout>\n')
    expect(findPreview(tree)).toHaveLength(0)
  })
})
