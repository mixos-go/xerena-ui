import { createContext, useContext, useCallback, useState, type ReactNode } from 'react'
import { View, Pressable, Text, type ViewStyle, type TextStyle } from 'react-native'
import { useNativeColors } from '../../hooks/useNativeColors'
import { spacing } from '../../styles/spacing'
import { body } from '../../styles/typography'

export interface RadioGroupContextValue {
  value: string
  onChange: (value: string) => void
  disabled: boolean
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

export function useRadioGroupContext(): RadioGroupContextValue | null {
  return useContext(RadioGroupContext)
}

export interface RadioGroupProps {
  value?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  disabled?: boolean
  children: ReactNode
  testID?: string
}

export function RadioGroup({
  value: controlledValue,
  onValueChange,
  orientation = 'vertical',
  disabled = false,
  children,
  testID,
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = useState<string>('')
  const currentValue = controlledValue ?? internalValue

  const onChange = useCallback(
    (value: string) => {
      if (disabled) return
      setInternalValue(value)
      onValueChange?.(value)
    },
    [onValueChange, disabled],
  )

  const containerStyle: ViewStyle = {
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    gap: spacing[2],
  }

  const contextValue: RadioGroupContextValue = {
    value: currentValue,
    onChange,
    disabled,
  }

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <View testID={testID} style={containerStyle} role="radiogroup" aria-disabled={!!disabled}>
        {children}
      </View>
    </RadioGroupContext.Provider>
  )
}

export interface RadioGroupItemProps {
  value: string
  children?: ReactNode
  disabled?: boolean
  testID?: string
  accessibilityLabel?: string
}

export function RadioGroupItem({
  value,
  children,
  disabled,
  testID,
  accessibilityLabel,
}: RadioGroupItemProps) {
  const colors = useNativeColors()
  const context = useRadioGroupContext()
  const isDisabled = disabled ?? context?.disabled ?? false
  const isChecked = context?.value === value

  const handlePress = () => {
    if (!isDisabled && context) {
      context.onChange(value)
    }
  }

  const SIZE = 20
  const DOT_SIZE = 8

  const containerStyle: ViewStyle = {
    width: SIZE,
    height: SIZE,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: isChecked ? colors.primary : colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  }

  const dotStyle: ViewStyle = {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: 9999,
    backgroundColor: colors.primary,
  }

  const labelStyle: TextStyle = {
    ...body.md,
    color: isDisabled ? colors.textMuted : colors.text,
    marginLeft: spacing[2],
  }

  return (
    <Pressable
      testID={testID}
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityRole="radio"
      accessibilityState={{
        checked: isChecked,
        disabled: isDisabled,
      }}
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: value }}
      style={({ pressed }: { pressed: boolean }) => [
        containerStyle,
        { opacity: pressed && !isDisabled ? 0.8 : 1, transform: pressed && !isDisabled ? [{ scale: 0.95 }] : [] },
      ]}
    >
      {isChecked && <View style={dotStyle} />}
      {children && <Text style={labelStyle}>{children}</Text>}
    </Pressable>
  )
}