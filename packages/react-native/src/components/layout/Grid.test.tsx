import { Text, View } from 'react-native'
import { render, screen } from '@testing-library/react-native'
import { semantic } from '@xerena/tokens'
import { Provider } from '../../primitives/Provider'
import { Grid } from './Grid'

function wrapper(theme: { mode: 'light' | 'dark' } = { mode: 'light' }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider theme={theme}>{children}</Provider>
  }
}

describe('Grid', () => {
  it('renders grid with columns', () => {
    render(
      <Grid testID="grid" columns={3}>
        <Text testID="child">g</Text>
      </Grid>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('grid')).toHaveStyle({ flexDirection: 'row', flexWrap: 'wrap' })
    expect(screen.getByTestId('grid')).toHaveStyle({ gap: semantic.spacing.md })
    expect(screen.getByTestId('child').parent?.props.style).toMatchObject({
      flexBasis: expect.stringMatching(/^33\.33/),
    })
  })

  it('renders auto grid', () => {
    render(
      <Grid testID="grid" auto>
        <Text testID="child">g</Text>
      </Grid>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('child').parent?.props.style).toMatchObject({ flex: 1 })
  })

  it('renders with as prop', () => {
    function Custom(props: { children: React.ReactNode }) {
      return <View {...props} testID="custom" />
    }
    render(
      <Grid testID="grid" as={Custom} columns={2}>
        g
      </Grid>,
      { wrapper: wrapper() },
    )
    expect(screen.getByTestId('custom')).toBeTruthy()
  })
})
