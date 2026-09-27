interface MdxPosition {
  start: { offset?: number }
  end: { offset?: number }
}

interface MdxJsxAttribute {
  type: string
  name?: string
  value?: unknown
}

interface MdxElement {
  type?: unknown
  name?: unknown
  attributes?: unknown
  children?: unknown
  position?: MdxPosition
}

interface MdxFile {
  value: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function sliceChildrenSource(source: string, node: MdxElement): string | undefined {
  const children = node.children
  if (!Array.isArray(children) || children.length === 0) return undefined
  const first = children[0]
  const last = children[children.length - 1]
  if (!isRecord(first) || !isRecord(last)) return undefined
  const firstPosition = first['position'] as MdxPosition | undefined
  const lastPosition = last['position'] as MdxPosition | undefined
  const start = firstPosition?.start.offset
  const end = lastPosition?.end.offset
  if (typeof start !== 'number' || typeof end !== 'number') return undefined
  return source.slice(start, end).trim()
}

function hasCodeAttribute(node: MdxElement): boolean {
  if (!Array.isArray(node.attributes)) return false
  return node.attributes.some(
    (attribute) => isRecord(attribute) && attribute['type'] === 'mdxJsxAttribute' && attribute['name'] === 'code',
  )
}

function visit(node: unknown, source: string): void {
  if (!isRecord(node)) return
  if (node['type'] === 'mdxJsxFlowElement' && node['name'] === 'Preview') {
    const element = node as unknown as MdxElement
    if (!hasCodeAttribute(element)) {
      const code = sliceChildrenSource(source, element)
      if (code !== undefined && code.length > 0) {
        const attributes: MdxJsxAttribute[] = Array.isArray(element.attributes) ? element.attributes : []
        attributes.push({ type: 'mdxJsxAttribute', name: 'code', value: code })
        ;(node as Record<string, unknown>)['attributes'] = attributes
      }
    }
  }
  const children = node['children']
  if (Array.isArray(children)) children.forEach((child) => visit(child, source))
}

export function previewCodePlugin() {
  return (tree: unknown, file: MdxFile): void => {
    if (typeof file.value !== 'string') return
    visit(tree, file.value)
  }
}
