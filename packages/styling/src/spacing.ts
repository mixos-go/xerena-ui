import { spacing, type SpacingKey } from '@xerena/tokens'

export type { SpacingKey } from '@xerena/tokens'

export function spacingValue(key: SpacingKey): number {
  return spacing[key]
}
