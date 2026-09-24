import { useState, useRef, useCallback } from 'react'
import { Text, TextInput, View, type ViewStyle, type TextStyle } from 'react-native'
import { Pressable } from '../../../primitives/Pressable'
import { useTableCtx } from './Table'
import { spacing } from '../../../styles/spacing'
import { body } from '../../../styles/typography'

export interface EditableCellProps {
  value: string
  onChange: (value: string) => void
  onCommit?: (value: string) => void
  placeholder?: string
  style?: ViewStyle
  textStyle?: TextStyle
  testID?: string
}

export function EditableCell({
  value,
  onChange,
  onCommit,
  placeholder,
  style,
  textStyle,
  testID = 'editable-cell',
}: EditableCellProps) {
  const { size, colors, cellStyle, cellBorderStyle } = useTableCtx()
  const { fontSize } = SIZE_STYLES[size]
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<TextInput>(null)

  const handleEdit = useCallback(() => {
    setEditValue(value)
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [value])

  const handleTextChange = useCallback(
    (text: string) => {
      setEditValue(text)
      onChange(text)
    },
    [onChange],
  )

  const handleBlur = useCallback(() => {
    setEditing(false)
    onCommit?.(editValue)
  }, [editValue, onCommit])

  const handleSubmit = useCallback(() => {
    setEditing(false)
    onCommit?.(editValue)
  }, [editValue, onCommit])

  const contentStyle: ViewStyle = {
    ...cellStyle,
    ...cellBorderStyle,
    minHeight: 40,
    ...style,
  }

  const textContentStyle: TextStyle = {
    ...body[fontSize],
    color: colors.text,
    ...textStyle,
  }

  const inputStyle: TextStyle = {
    flex: 1,
    ...body[fontSize],
    color: colors.text,
    paddingVertical: 0,
    paddingHorizontal: 0,
  }

  if (editing) {
    return (
      <View testID={testID} style={contentStyle} accessibilityLabel="Edit cell value">
        <TextInput
          ref={inputRef}
          value={editValue}
          onChangeText={handleTextChange}
          onBlur={handleBlur}
          onSubmitEditing={handleSubmit}
          placeholder={placeholder}
          style={[inputStyle, textStyle]}
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    )
  }

  return (
    <Pressable
      testID={testID}
      onPress={handleEdit}
      accessibilityRole="button"
      accessibilityLabel="Edit cell"
      style={contentStyle}
    >
      <Text style={textContentStyle} numberOfLines={1}>
        {value || (placeholder ? <Text style={{ color: colors.textMuted }}>{placeholder}</Text> : '')}
      </Text>
    </Pressable>
  )
}

const SIZE_STYLES: Record<NonNullable<ReturnType<typeof useTableCtx>['size']>, { cellPadding: number; fontSize: keyof typeof body }> = {
  sm: { cellPadding: spacing[1], fontSize: 'sm' },
  md: { cellPadding: spacing[2], fontSize: 'md' },
  lg: { cellPadding: spacing[3], fontSize: 'lg' },
}