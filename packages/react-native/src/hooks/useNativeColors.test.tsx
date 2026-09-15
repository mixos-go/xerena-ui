import { Text } from 'react-native'
import { render, screen } from '@testing-library/react-native'
import { semantic, semanticDark } from '@xerena/tokens'
import { Provider } from '../primitives/Provider'
import { useNativeColors } from './useNativeColors'

function Consumer() {
  const colors = useNativeColors()
  return <Text testID="color">{colors.primary}</Text>
}

describe('useNativeColors', () => {
  it('returns resolved light palette', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <Consumer />
      </Provider>,
    )
    expect(screen.getByTestId('color').children[0]).toBe(semantic.color.primary)
  })

  it('returns resolved dark palette', () => {
    render(
      <Provider theme={{ mode: 'dark' }}>
        <Consumer />
      </Provider>,
    )
    expect(screen.getByTestId('color').children[0]).toBe(semanticDark.color.primary)
  })

  it('throws outside Provider', () => {
    expect(() => render(<Consumer />)).toThrow('useNativeColors must be used within <Provider>')
  })
})
