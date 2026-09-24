import { forwardRef, useCallback } from 'react'
import { TextInput, View, Text, type ViewStyle, type TextStyle } from 'react-native'
import { Pressable } from '../../primitives/Pressable'
import { useNativeColors } from '../../hooks/useNativeColors'
import { useControllableState } from '../../hooks/useControllableState'
import { spacing } from '../../styles/spacing'
import { radius } from '../../styles/radius'
import { body } from '../../styles/typography'

export interface NumberInputProps {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  variant?: 'default' | 'compact'
  disabled?: boolean
  testID?: string
  accessibilityLabel?: string
}

const BUTTON_SIZE = 32

export const NumberInput = forwardRef<View, NumberInputProps>(
  function NumberInput(
    {
      value: controlledValue,
      defaultValue = 0,
      onValueChange,
      min = -Infinity,
      max = Infinity,
      step = 1,
      variant = 'default',
      disabled,
      testID,
      accessibilityLabel,
    },
    ref,
  ) {
    const colors = useNativeColors()
    const isDisabled = !!disabled

    const [internalValue, setInternalValue] = useControllableState(controlledValue, defaultValue)
    const currentValue = controlledValue ?? internalValue

    const handleChange = useCallback(
      (newValue: number) => {
        const clamped = Math.min(max, Math.max(min, newValue))
        setInternalValue(clamped)
        onValueChange?.(clamped)
      },
      [min, max, setInternalValue, onValueChange],
    )

    const handleTextChange = (text: string) => {
      const num = Number(text)
      if (!Number.isNaN(num)) {
        handleChange(num)
      }
    }

    const increment = () => handleChange(currentValue + step)
    const decrement = () => handleChange(currentValue - step)

    const canIncrement = currentValue < max
    const canDecrement = currentValue > min

    const containerStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: 'transparent',
      overflow: 'hidden',
    }

    const buttonStyle: ViewStyle = {
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.surface,
    }

    const buttonDisabledStyle: ViewStyle = {
      opacity: 0.5,
    }

    const inputStyle: TextStyle = {
      ...body.md,
      color: colors.text,
      textAlign: 'center',
      width: variant === 'compact' ? 80 : 100,
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[2],
    }

    const buttonTextStyle: TextStyle = {
      ...body.md,
      color: colors.text,
      fontSize: 18,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const textInputProps: any = {
      value: String(currentValue),
      onChangeText: handleTextChange,
      editable: !isDisabled,
      style: inputStyle,
      placeholderTextColor: colors.textMuted,
      selectionColor: colors.primary,
      caretHidden: false,
      keyboardType: 'numeric',
      accessibilityRole: 'spinbutton',
      accessibilityValue: { min, max, now: currentValue },
      accessibilityLabel,
    }

    if (variant === 'compact') {
      return (
        <View ref={ref} testID={testID} style={containerStyle}>
          <Pressable
            testID={testID ? `${testID}-decrement` : undefined}
            onPress={decrement}
            disabled={isDisabled || !canDecrement}
            style={[{ ...buttonStyle, borderRightWidth: 1, borderColor: colors.border }, !canDecrement && buttonDisabledStyle]}
            accessibilityLabel={accessibilityLabel ? `${accessibilityLabel}, decrease` : 'Decrease'}
          >
            <Text style={buttonTextStyle}>−</Text>
          </Pressable>
          <TextInput testID={testID ? `${testID}-input` : undefined} {...textInputProps} />
          <Pressable
            testID={testID ? `${testID}-increment` : undefined}
            onPress={increment}
            disabled={isDisabled || !canIncrement}
            style={[{ ...buttonStyle, borderLeftWidth: 1, borderColor: colors.border }, !canIncrement && buttonDisabledStyle]}
            accessibilityLabel={accessibilityLabel ? `${accessibilityLabel}, increase` : 'Increase'}
          >
            <Text style={buttonTextStyle}>+</Text>
          </Pressable>
        </View>
      )
    }

    return (
      <View ref={ref} testID={testID} style={containerStyle}>
        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
          <Pressable
            testID={testID ? `${testID}-increment` : undefined}
            onPress={increment}
            disabled={isDisabled || !canIncrement}
            style={[{ ...buttonStyle, borderBottomWidth: 1, borderColor: colors.border }, !canIncrement && buttonDisabledStyle]}
            accessibilityLabel={accessibilityLabel ? `${accessibilityLabel}, increase` : 'Increase'}
          >
            <Text style={buttonTextStyle}>↑</Text>
          </Pressable>
          <Pressable
            testID={testID ? `${testID}-decrement` : undefined}
            onPress={decrement}
            disabled={isDisabled || !canDecrement}
            style={[{ ...buttonStyle }, !canDecrement && buttonDisabledStyle]}
            accessibilityLabel={accessibilityLabel ? `${accessibilityLabel}, decrease` : 'Decrease'}
          >
            <Text style={buttonTextStyle}>↓</Text>
          </Pressable>
        </View>
        <TextInput testID={testID ? `${testID}-input` : undefined} {...textInputProps} />
      </View>
    )
  },
)

NumberInput.displayName = 'NumberInput'