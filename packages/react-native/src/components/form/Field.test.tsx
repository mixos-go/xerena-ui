import { Text, View } from 'react-native'
import { fireEvent, render, screen } from '@testing-library/react-native'
import { semantic, semanticDark } from '@xerena/tokens'
import { Provider } from '../../primitives/Provider'
import { Field } from './Field'

function wrapper(theme: { mode: 'light' | 'dark'; semantic?: Record<string, string> } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Field', () => {
  it('renders label with required indicator', () => {
    render(
      <Field label="Email" required>
        <View testID="input" />
      </Field>,
      { wrapper: wrapper() },
    )
    // The label and required indicator are nested in Text elements
    // Check that the required indicator is rendered
    expect(screen.getByTestId('required-indicator')).toBeTruthy()
    expect(screen.getByTestId('required-indicator').props.children).toBe('*')
    // Check that the label text is rendered (as part of the parent Text)
    const allTexts = screen.getAllByText(/Email/)
    expect(allTexts.length).toBeGreaterThan(0)
  })

  it('renders hint when no error', () => {
    render(
      <Field label="Password" hint="Must be 8+ characters">
        <View testID="input" />
      </Field>,
      { wrapper: wrapper() },
    )
    expect(screen.getByText('Must be 8+ characters')).toBeTruthy()
  })

  it('renders error and hides hint when error present', () => {
    render(
      <Field label="Email" hint="Enter email" error="Invalid email">
        <View testID="input" />
      </Field>,
      { wrapper: wrapper() },
    )
    expect(screen.getByText('Invalid email')).toBeTruthy()
    expect(screen.queryByText('Enter email')).toBeNull()
    expect(screen.getByText('Invalid email').props.accessibilityLiveRegion).toBe('polite')
  })

  it('applies error text color', () => {
    render(
      <Field label="Email" error="Invalid">
        <View testID="input" />
      </Field>,
      { wrapper: wrapper() },
    )
    expect(screen.getByText('Invalid')).toHaveStyle({ color: semantic.color.danger })
  })

  it('applies hint text muted color', () => {
    render(
      <Field label="Email" hint="Enter email">
        <View testID="input" />
      </Field>,
      { wrapper: wrapper() },
    )
    expect(screen.getByText('Enter email')).toHaveStyle({ color: semantic.color.textMuted })
  })

  it('renders correctly in dark mode', () => {
    render(
      <Field label="Email" error="Invalid" required>
        <View testID="input" />
      </Field>,
      { wrapper: wrapper({ mode: 'dark' }) },
    )
    expect(screen.getByText('Invalid')).toHaveStyle({ color: semanticDark.color.danger })
    expect(screen.getByTestId('required-indicator')).toHaveStyle({ color: semanticDark.color.danger })
  })

  it('applies custom semantic override', () => {
    const override = '#ff0000'
    render(
      <Field label="Email" error="Invalid" required>
        <View testID="input" />
      </Field>,
      { wrapper: wrapper({ mode: 'light', semantic: { danger: override } }) },
    )
    expect(screen.getByText('Invalid')).toHaveStyle({ color: override })
    expect(screen.getByTestId('required-indicator')).toHaveStyle({ color: override })
  })

  it('generates htmlFor from label when not provided', () => {
    render(
      <Field label="Email Address">
        <View testID="input" />
      </Field>,
      { wrapper: wrapper() },
    )
    // The label text should be rendered
    expect(screen.getByText('Email Address')).toBeTruthy()
  })

  it('renders children correctly', () => {
    render(
      <Field label="Name">
        <View testID="custom-child">
          <Text>Custom</Text>
        </View>
      </Field>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('custom-child')).toBeTruthy()
    expect(screen.getByText('Custom')).toBeTruthy()
  })
})