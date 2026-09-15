import {
  typography as tokens,
  type BodySizeKey,
  type DisplaySizeKey,
  type MonoSizeKey,
} from '@xerena/tokens'
import type { TextStyle } from 'react-native'

export type TypographyStyle = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'fontWeight' | 'lineHeight' | 'letterSpacing'
>

export const display = Object.fromEntries(
  Object.entries(tokens.display).map(([key, value]) => [
    key,
    { fontFamily: tokens.fontFamily.display, ...value },
  ]),
) as unknown as Record<DisplaySizeKey, TypographyStyle>

export const body = Object.fromEntries(
  Object.entries(tokens.body).map(([key, value]) => [
    key,
    { fontFamily: tokens.fontFamily.body, ...value },
  ]),
) as unknown as Record<BodySizeKey, TypographyStyle>

export const mono = Object.fromEntries(
  Object.entries(tokens.mono).map(([key, value]) => [
    key,
    { fontFamily: tokens.fontFamily.mono, ...value },
  ]),
) as unknown as Record<MonoSizeKey, TypographyStyle>
