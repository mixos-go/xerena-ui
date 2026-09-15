import { forwardRef } from 'react'
import { View, type ViewStyle } from 'react-native'
import { Pressable } from '../../primitives/Pressable'
import { useNativeColors } from '../../hooks/useNativeColors'
import { spacing } from '../../styles/spacing'
import { radius } from '../../styles/radius'
import type { PressableStateCallbackType } from 'react-native'

export interface RadioProps {
  value: string
  checked?: boolean
  onChange?: () => void
  disabled?: boolean
  testID?: string
  accessibilityLabel?: string
}

const SIZE = 20
const DOT_SIZE = 8

export const Radio = forwardRef<View, RadioProps>(
  function Radio({ value, checked, onChange, disabled, testID, accessibilityLabel }, ref) {
    const colors = useNativeColors()
    const isDisabled = !!disabled

    const handlePress = () => {
      if (!isDisabled) {
        onChange?.()
      }
    }

    const containerStyle: ViewStyle = {
      width: SIZE,
      height: SIZE,
      borderRadius: radius.full,
      borderWidth: 2,
      borderColor: checked ? colors.primary : colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    }

    const dotStyle: ViewStyle = {
      width: DOT_SIZE,
      height: DOT_SIZE,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
    }

    return (
      <Pressable
        ref={ref}
        testID={testID}
        onPress={handlePress}
        disabled={isDisabled}
        accessibilityRole="radio"
        accessibilityState={{
          checked: !!checked,
          disabled: isDisabled,
        }}
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ text: value }}
        style={({ pressed }: PressableStateCallbackType) => [
          containerStyle,
          { opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1, transform: pressed && !isDisabled ? [{ scale: 0.95 }] : [] },
        ]}
      >
        {checked && <View style={dotStyle} />}
      </Pressable>
    )
  },
)

Radio.displayName = 'Radio'