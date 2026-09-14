export type VariantName = string
export function variantClass(base: string, variant?: string): string {
  return variant ? `${base}--${variant}` : base
}
export function sizeClass(base: string, size?: string): string {
  return size ? `${base}--${size}` : base
}
