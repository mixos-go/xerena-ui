import React from 'react'
import { Text } from 'react-native'
import { render } from '@testing-library/react-native'
import { Provider } from './Provider'

describe('Provider', () => {
  it('renders theme mode indicator', () => {
    const { getByText } = render(
      <Provider>
        <Text>child</Text>
      </Provider>,
    )
    expect(getByText('xerena-theme:light')).toBeDefined()
  })
})