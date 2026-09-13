export function cssVar(path: string): string {
  return `var(--xr-${path.split('.').join('-')})`
}

function unitFor(path: string): 'px' | 'ms' | null {
  if (
    path.startsWith('spacing.') ||
    path.startsWith('radius.') ||
    path.includes('.fontSize') ||
    path.includes('.lineHeight')
  ) {
    return 'px'
  }
  if (path.startsWith('motion.duration.')) {
    return 'ms'
  }
  return null
}

export function css(path: string): string {
  const variable = cssVar(path)
  if (path.startsWith('motion.easing.')) {
    return `cubic-bezier(${variable})`
  }
  const unit = unitFor(path)
  if (unit !== null) {
    return `calc(${variable} * 1${unit})`
  }
  return variable
}
