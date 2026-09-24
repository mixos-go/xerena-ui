import { useEffect, useRef, useState } from 'react'
import { Animated, Text, View, type ViewStyle, type TextStyle } from 'react-native'
import { Pressable } from '../../../primitives/Pressable'
import { useNativeColors } from '../../../hooks/useNativeColors'
import { useNativeMotion } from '../../../hooks/useNativeMotion'
import { radius } from '../../../styles/radius'

export interface TableCheckboxProps {
  checked: boolean | 'indeterminate'
  onCheckedChange: (value: boolean) => void
  ariaLabel?: string
  style?: ViewStyle
  testID?: string
}

export function TableCheckbox({
  checked,
  onCheckedChange,
  ariaLabel = 'Select row',
  style,
  testID = 'checkbox',
}: TableCheckboxProps) {
  const colors = useNativeColors()
  const { animate, reduced } = useNativeMotion()
  const [indeterminate, setIndeterminate] = useState(checked === 'indeterminate')
  const [scale, setScale] = useState(1)
  const scaleAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    setIndeterminate(checked === 'indeterminate')
  }, [checked])

  useEffect(() => {
    if (!reduced) {
      Animated.timing(scaleAnim, animate({ toValue: scale, duration: 'instant', easing: 'standard' })).start()
    } else {
      scaleAnim.setValue(scale)
    }
  }, [scale, animate, reduced, scaleAnim])

  const handlePress = () => {
    setScale(0.9)
    Animated.timing(scaleAnim, animate({ toValue: 0.9, duration: 'instant', easing: 'standard' })).start(() => {
      onCheckedChange(!indeterminate && checked === true ? false : true)
      setScale(1)
      Animated.timing(scaleAnim, animate({ toValue: 1, duration: 'fast', easing: 'standard' })).start()
    })
  }

  const isChecked = checked === true
  const isIndeterminate = checked === 'indeterminate'

  const checkboxStyle: ViewStyle = {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: isChecked || isIndeterminate ? colors.primary : colors.border,
    backgroundColor: isChecked || isIndeterminate ? colors.primary : 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  }

  const checkmarkStyle: TextStyle = {
    color: colors.textOnStrong,
    fontSize: 14,
    fontWeight: 'bold',
  }

  const indeterminateStyle: ViewStyle = {
    width: '60%',
    height: 2,
    backgroundColor: colors.textOnStrong,
    borderRadius: 1,
  }

  return (
    <Pressable
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked ? true : isIndeterminate ? 'mixed' : false }}
      accessibilityLabel={ariaLabel}
      onPress={handlePress}
      style={[{ transform: [{ scale: scaleAnim }] }, checkboxStyle]}
    >
      {isIndeterminate ? (
        <View style={indeterminateStyle} />
      ) : isChecked ? (
        <Text style={checkmarkStyle}>✓</Text>
      ) : null}
    </Pressable>
  )
}