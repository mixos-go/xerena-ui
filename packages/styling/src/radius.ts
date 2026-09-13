import { radius, type RadiusKey } from '@xerena/tokens'

export type { RadiusKey } from '@xerena/tokens'

export function radiusValue(key: RadiusKey): number {
  return radius[key]
}
