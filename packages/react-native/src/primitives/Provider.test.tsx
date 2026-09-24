import { Text } from 'react-native'
import { act, render, screen } from '@testing-library/react-native'
import { semantic, semanticDark } from '@xerena/tokens'
import { useNativeColors } from '../hooks/useNativeColors'
import { Provider } from './Provider'
import { useTheme, useThemeMode } from './ThemeContext'

function Consumer() {
  const { theme, setTheme, semantic: palette } = useTheme()
  return (
    <>
      <Text testID="mode">{theme.mode}</Text>
      <Text testID="primary">{palette.primary}</Text>
      <Text testID="setter">{typeof setTheme}</Text>
    </>
  )
}

function ModeConsumer() {
  return <Text testID="mode-only">{useThemeMode()}</Text>
}

describe('Provider', () => {
  it('provides light palette values from semantic.color', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Consumer />
      </Provider>,
    )
    expect(screen.getByTestId('mode').children[0]).toBe('light')
    expect(screen.getByTestId('primary').children[0]).toBe(semantic.color.primary)
    expect(screen.getByTestId('setter').children[0]).toBe('function')
  })

  it('provides dark palette values from semanticDark.color', () => {
    render(
      <Provider theme={{ mode: 'dark' }}>
        <Consumer />
      </Provider>,
    )
    expect(screen.getByTestId('mode').children[0]).toBe('dark')
    expect(screen.getByTestId('primary').children[0]).toBe(semanticDark.color.primary)
  })

  it('lets custom semantic overrides win in light mode', () => {
    const override = '#ff0000'
    render(
      <Provider theme={{ mode: 'light', semantic: { primary: override } }}>
        <Consumer />
      </Provider>,
    )
    expect(screen.getByTestId('primary').children[0]).toBe(override)
    expect(screen.getByTestId('mode').children[0]).toBe('light')
  })

  it('lets custom semantic overrides win in dark mode', () => {
    const override = '#00ff00'
    render(
      <Provider theme={{ mode: 'dark', semantic: { danger: override } }}>
        <Consumer />
      </Provider>,
    )
    expect(screen.getByTestId('primary').children[0]).toBe(semanticDark.color.primary)
  })

  it('switches mode via setTheme', () => {
    function ModeSwitcher() {
      const { theme, setTheme } = useTheme()
      return (
        <>
          <Text testID="mode">{theme.mode}</Text>
          <Text testID="switch" onPress={() => setTheme({ mode: 'dark' })}>
            switch
          </Text>
        </>
      )
    }

    const { getByTestId } = render(
      <Provider theme={{ mode: 'light' }}>
        <ModeSwitcher />
      </Provider>,
    )
    expect(getByTestId('mode').children[0]).toBe('light')
    act(() => {
      getByTestId('switch').props.onPress()
    })
    expect(getByTestId('mode').children[0]).toBe('dark')
  })

  it('useThemeMode returns light when unset', () => {
    render(<ModeConsumer />)
    expect(screen.getByTestId('mode-only').children[0]).toBe('light')
  })

  it('useNativeColors reflects the active mode', () => {
    function Toggler() {
      const { theme, setTheme } = useTheme()
      return (
        <>
          <Text testID="mode">{theme.mode}</Text>
          <Text testID="background">{useNativeColors().background}</Text>
          <Text testID="switch" onPress={() => setTheme({ mode: theme.mode === 'light' ? 'dark' : 'light' })}>
            switch
          </Text>
        </>
      )
    }

    const { getByTestId } = render(
      <Provider theme={{ mode: 'light' }}>
        <Toggler />
      </Provider>,
    )
    expect(getByTestId('background').children[0]).toBe(semantic.color.background)

    act(() => {
      getByTestId('switch').props.onPress()
    })
    expect(getByTestId('mode').children[0]).toBe('dark')
    expect(getByTestId('background').children[0]).toBe(semanticDark.color.background)
  })
})
