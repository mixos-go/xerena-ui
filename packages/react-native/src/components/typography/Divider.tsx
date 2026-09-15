import { StyleSheet, Text, View, type ViewStyle } from 'react-native'
import { useNativeColors } from '../../hooks/useNativeColors'
import { semantic } from '@xerena/tokens'

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed'
  label?: string
  className?: string
  testID?: string
}

export function Divider({ orientation = 'horizontal', variant = 'solid', label, testID }: DividerProps) {
  const colors = useNativeColors()
  const baseColor = colors.border

  if (label) {
    return (
      <View testID={testID} style={styles.row}>
        <View style={[styles.flexLine, { backgroundColor: baseColor, borderStyle: variant }]} />
        <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
        <View style={[styles.flexLine, { backgroundColor: baseColor, borderStyle: variant }]} />
      </View>
    )
  }

  const style: ViewStyle =
    orientation === 'vertical'
      ? { width: 1, height: '100%', backgroundColor: baseColor }
      : { width: '100%', height: 1, backgroundColor: baseColor }

  return <View testID={testID} style={[style, { borderStyle: variant }]} />
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  flexLine: {
    flex: 1,
    height: 1,
  },
  label: {
    marginHorizontal: semantic.spacing.sm,
    fontSize: 12,
  },
})
