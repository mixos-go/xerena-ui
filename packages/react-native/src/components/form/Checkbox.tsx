import { forwardRef } from 'react'
import { Text, View, type ViewStyle, type TextStyle } from 'react-native'
import { Pressable } from '../../primitives/Pressable'
import { useNativeColors } from '../../hooks/useNativeColors'
import { useControllableState } from '../../hooks/useControllableState'
import { radius } from '../../styles/radius'
import type { PressableStateCallbackType } from 'react-native'

export interface CheckboxProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  indeterminate?: boolean
  testID?: string
  accessibilityLabel?: string
}

const SIZE = 20
const CHECK_SIZE = 14

export const Checkbox = forwardRef<View, CheckboxProps>(
  function Checkbox(
    {
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      disabled,
      indeterminate = false,
      testID,
      accessibilityLabel,
    },
    ref,
  ) {
    const colors = useNativeColors()
    const isDisabled = !!disabled

    const [internalChecked, setInternalChecked] = useControllableState(controlledChecked, defaultChecked)
    const checked = controlledChecked ?? internalChecked

    const handlePress = () => {
      if (!isDisabled) {
        const next = !checked
        setInternalChecked(next)
        onCheckedChange?.(next)
      }
    }

    const containerStyle: ViewStyle = {
      width: SIZE,
      height: SIZE,
      borderRadius: radius.sm,
      borderWidth: 2,
      borderColor: checked || indeterminate ? colors.primary : colors.border,
      backgroundColor: checked || indeterminate ? colors.primary : 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    }

    const checkStyle: TextStyle = {
      color: colors.textOnStrong,
      fontSize: CHECK_SIZE,
      fontWeight: 'bold',
    }

    const indeterminateStyle: ViewStyle = {
      width: SIZE * 0.5,
      height: 2,
      backgroundColor: colors.textOnStrong,
      borderRadius: 1,
    }

    return (
      <Pressable
        ref={ref}
        testID={testID}
        onPress={handlePress}
        disabled={isDisabled}
        accessibilityRole="checkbox"
        accessibilityState={{
          checked: indeterminate ? 'mixed' : checked,
          disabled: isDisabled,
        }}
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }: PressableStateCallbackType) => [
          containerStyle,
          { opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1, transform: pressed && !isDisabled ? [{ scale: 0.95 }] : [] },
        ]}
      >
        {indeterminate ? (
          <View style={indeterminateStyle} />
        ) : checked ? (
          <Text style={checkStyle}>✓</Text>
        ) : null}
      </Pressable>
    )
  },
)

Checkbox.displayName = 'Checkbox'