import { elevation, type ElevationLevel } from '@xerena/tokens'
import { Platform } from 'react-native'

export interface NativeElevationStyle {
  shadowColor?: string
  shadowOffset?: { width: number; height: number }
  shadowOpacity?: number
  shadowRadius?: number
  elevation?: number
}

const layerRegex =
  /0\s+(-?\d+(?:\.\d+)?)px\s+(-?\d+(?:\.\d+)?)px(?:\s+-?\d+(?:\.\d+)?px)?\s+rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/

interface ShadowLayer {
  offsetY: number
  blur: number
  r: number
  g: number
  b: number
  a: number
}

function parseLayer(input: string): ShadowLayer | null {
  const match = layerRegex.exec(input.trim())
  if (!match) return null
  const values = match
    .slice(1, 7)
    .map((value) => Number.parseFloat(value ?? '0')) as number[]
  return {
    offsetY: values[0] as number,
    blur: values[1] as number,
    r: values[2] as number,
    g: values[3] as number,
    b: values[4] as number,
    a: values[5] as number,
  }
}

export function nativeElevation(level: ElevationLevel): NativeElevationStyle {
  const value = elevation[level]
  if (!value || value === 'none' || value === '0 none') return {}

  const layers = value
    .split(', ')
    .map(parseLayer)
    .filter((layer): layer is ShadowLayer => layer !== null)

  if (layers.length === 0) return {}

  const deepest = layers.reduce(
    (max, layer) => (layer.blur > max.blur ? layer : max),
    layers[0] as ShadowLayer,
  )

  if (Platform.OS === 'android') {
    return { elevation: Math.round(deepest.blur / 4) }
  }

  return {
    shadowColor: `rgb(${deepest.r}, ${deepest.g}, ${deepest.b})`,
    shadowOffset: { width: 0, height: deepest.offsetY },
    shadowRadius: deepest.blur,
    shadowOpacity: deepest.a,
  }
}
