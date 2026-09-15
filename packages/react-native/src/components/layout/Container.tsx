import type { ReactNode } from 'react'
import { View, type ViewStyle } from 'react-native'

export interface ContainerProps {
  variant?: 'centered' | 'fluid' | 'narrow'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  as?: React.ElementType
  className?: string
  children: ReactNode
  testID?: string
}

const WIDTH = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const

export function Container({
  variant = 'centered',
  size = 'lg',
  as: Comp = View,
  children,
  testID,
  ...rest
}: ContainerProps) {
  const style: ViewStyle =
    variant === 'fluid'
      ? { width: '100%' }
      : { maxWidth: variant === 'narrow' ? 720 : WIDTH[size], width: '100%', alignSelf: 'center' }

  return (
    <Comp testID={testID} style={style} {...rest}>
      {children}
    </Comp>
  )
}
