import { forwardRef, useRef } from 'react'
import { TextInput, View, type TextStyle, type ViewStyle } from 'react-native'
import { useNativeColors } from '../../hooks/useNativeColors'
import { useControllableState } from '../../hooks/useControllableState'
import { useFieldContext } from './Field'
import { spacing } from '../../styles/spacing'
import { radius } from '../../styles/radius'
import { body } from '../../styles/typography'

export interface TextareaProps extends Omit<
  React.ComponentPropsWithoutRef<typeof TextInput>,
  'onChange' | 'onChangeText' | 'value' | 'defaultValue' | 'disabled' | 'error' | 'multiline'
> {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onChangeText?: (value: string) => void
  disabled?: boolean
  error?: boolean
  resize?: 'none' | 'auto'
  minHeight?: number
  testID?: string
}

export const Textarea = forwardRef<View, TextareaProps>(
  function Textarea(
    {
      value: controlledValue,
      defaultValue = '',
      onChange,
      onChangeText,
      disabled,
      error: propError,
      resize = 'none',
      minHeight = 100,
      testID,
      style,
      ...rest
    },
    ref,
  ) {
    const colors = useNativeColors()
    const fieldContext = useFieldContext()
    const isDisabled = disabled ?? fieldContext?.disabled ?? false
    const isError = propError ?? fieldContext?.error ?? false

    const [internalValue, setInternalValue] = useControllableState(controlledValue, defaultValue)
    const currentValue = controlledValue ?? internalValue

    const handleChangeText = (text: string) => {
      setInternalValue(text)
      onChange?.(text)
      onChangeText?.(text)
    }

    const containerStyle: ViewStyle = {
      borderRadius: radius.md,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: isError ? colors.danger : colors.border,
      minHeight,
    }

    const textStyle: TextStyle = {
      ...body.md,
      color: colors.text,
    }

    const inputRef = useRef<TextInput>(null)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const textInputProps = rest as any

    return (
      <View testID={testID} style={[{ opacity: isDisabled ? 0.5 : 1 }, containerStyle, style]}>
        <TextInput
          ref={inputRef}
          testID={testID ? `${testID}-input` : undefined}
          value={currentValue}
          onChangeText={handleChangeText}
          disabled={isDisabled}
          editable={!isDisabled}
          multiline
          style={[
            textStyle,
            { textAlignVertical: 'top' },
          ]}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          caretHidden={false}
          {...textInputProps}
        />
      </View>
    )
  },
)

Textarea.displayName = 'Textarea'