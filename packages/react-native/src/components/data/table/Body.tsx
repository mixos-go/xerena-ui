import { type ReactNode } from 'react'
import { StyleSheet, View, type ViewStyle } from 'react-native'

export interface BodyProps {
  children: ReactNode
  style?: ViewStyle
  testID?: string
}

export function Body({ children, style, testID = 'body' }: BodyProps) {
  return (
    <View testID={testID} style={[styles.container, style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})