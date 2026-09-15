import type { ReactNode } from 'react'
import { Text, View, type ViewStyle } from 'react-native'
import { useNativeColors } from '../../hooks/useNativeColors'
import { radius } from '../../styles/radius'
import { mono } from '../../styles/typography'

export interface KbdProps {
  className?: string
  children: ReactNode
  testID?: string
}

export function Kbd({ children, testID }: KbdProps) {
  const colors = useNativeColors()

  const style: ViewStyle = {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  }

  return (
    <View testID={testID} style={style}>
      <Text style={{ ...mono.sm, color: colors.text }}>{children}</Text>
    </View>
  )
}
