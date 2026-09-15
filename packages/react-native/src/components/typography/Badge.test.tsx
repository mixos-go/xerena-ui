import { render, screen } from '@testing-library/react-native'
import { semantic, semanticDark } from '@xerena/tokens'
import { Provider } from '../../primitives/Provider'
import { Badge } from './Badge'

function wrapper(theme: { mode: 'light' | 'dark'; semantic?: Record<string, string> } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Badge', () => {
  it.each([
    ['neutral', semantic.color.surface, semantic.color.textMuted],
    ['brand', semantic.color.primary, semantic.color.textOnStrong],
    ['info', semantic.color.infoSurface, semantic.color.infoText],
    ['success', semantic.color.successSurface, semantic.color.successText],
    ['warning', semantic.color.warningSurface, semantic.color.warningText],
    ['danger', semantic.color.dangerSurface, semantic.color.dangerText],
  ] as const)('applies %s tone colors', (tone, bg, color) => {
    render(
      <Badge testID="badge" tone={tone}>
        {tone}
      </Badge>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('badge')).toHaveStyle({ backgroundColor: bg })
    expect(screen.getByText(tone)).toHaveStyle({ color })
  })

  it('applies size styles', () => {
    render(
      <Badge testID="badge" size="sm">
        small
      </Badge>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('badge')).toHaveStyle({ paddingHorizontal: semantic.spacing.sm })
  })

  it('renders correctly in dark mode', () => {
    render(
      <Badge testID="badge" tone="success">
        Dark
      </Badge>,
      { wrapper: wrapper({ mode: 'dark' }) },
    )
    expect(screen.getByTestId('badge')).toHaveStyle({ backgroundColor: semanticDark.color.successSurface })
    expect(screen.getByText('Dark')).toHaveStyle({ color: semanticDark.color.successText })
  })

  it('applies custom semantic override', () => {
    const override = '#ff0000'
    render(
      <Badge testID="badge" tone="brand">
        Override
      </Badge>,
      { wrapper: wrapper({ semantic: { primary: override } }) },
    )
    expect(screen.getByTestId('badge')).toHaveStyle({ backgroundColor: override })
  })
})
