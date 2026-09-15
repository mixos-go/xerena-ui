import type { ReactNode } from 'react'
import { Text as RNText, type TextProps as RNTextProps } from 'react-native'
import { useNativeColors } from '../../hooks/useNativeColors'
import { display } from '../../styles/typography'

export interface HeadingProps extends Omit<RNTextProps, 'children'> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | React.ElementType
  children: ReactNode
}

const SIZE_MAP: Record<string, keyof typeof display> = {
  h1: 'xl',
  h2: 'lg',
  h3: 'md',
  h4: 'sm',
  h5: 'xs',
  h6: 'xs',
}

export function Heading({ as = 'h2', style, children, ...rest }: HeadingProps) {
  const colors = useNativeColors()

  if (typeof as === 'string' && as in SIZE_MAP) {
    const size = SIZE_MAP[as]
    return (
      <RNText style={[display[size], { color: colors.text }, style]} {...rest}>
        {children}
      </RNText>
    )
  }

  const Comp = as as React.ElementType
  return (
    <Comp style={[{ color: colors.text }, style]} {...rest}>
      {children}
    </Comp>
  )
}
