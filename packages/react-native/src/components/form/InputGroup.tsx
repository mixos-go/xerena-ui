import { createContext, useCallback, useContext, useState, type ReactNode, Children, isValidElement, cloneElement } from 'react'
import { View, type ViewStyle } from 'react-native'
import { useNativeColors } from '../../hooks/useNativeColors'
import { radius } from '../../styles/radius'

export interface InputGroupContextValue {
  hasError: boolean
  focused: boolean
  setFocused: (focused: boolean) => void
}

const InputGroupContext = createContext<InputGroupContextValue | null>(null)

export function useInputGroupContext(): InputGroupContextValue | null {
  return useContext(InputGroupContext)
}

type FocusHandler = (e: unknown) => void

export interface InputGroupProps {
  children: ReactNode
  testID?: string
  error?: boolean
}

export function InputGroup({ children, testID, error = false }: InputGroupProps) {
  const colors = useNativeColors()
  const [focused, setFocused] = useState(false)

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: error ? colors.danger : focused ? colors.primary : colors.border,
    backgroundColor: 'transparent',
  }

  const chainFocus = useCallback(
    (childHandler: FocusHandler | undefined, next: boolean): FocusHandler => (e: unknown) => {
      setFocused(next)
      childHandler?.(e)
    },
    [],
  )

  const contextValue: InputGroupContextValue = {
    hasError: error,
    focused,
    setFocused,
  }

  return (
    <InputGroupContext.Provider value={contextValue}>
      <View testID={testID} style={containerStyle}>
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return child
          const props = child.props as { onFocus?: FocusHandler; onBlur?: FocusHandler }
          return cloneElement(
            child as React.ReactElement<{ onFocus?: FocusHandler; onBlur?: FocusHandler }>,
            {
              onFocus: chainFocus(props.onFocus, true),
              onBlur: chainFocus(props.onBlur, false),
            },
          )
        })}
      </View>
    </InputGroupContext.Provider>
  )
}

export interface InputGroupAddonProps {
  children: ReactNode
  testID?: string
  position?: 'left' | 'right'
}

export function InputGroupAddon({ children, testID, position = 'left' }: InputGroupAddonProps) {
  const colors = useNativeColors()
  const context = useInputGroupContext()

  const addonStyle: ViewStyle = {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: context?.hasError ? colors.dangerSurface : colors.surface,
    borderRightWidth: position === 'left' ? 1 : 0,
    borderLeftWidth: position === 'right' ? 1 : 0,
    borderColor: context?.hasError ? colors.danger : colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  }

  return <View testID={testID} style={addonStyle}>{children}</View>
}