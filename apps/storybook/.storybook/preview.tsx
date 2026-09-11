import React from 'react'
import type { Preview } from '@storybook/react'
import { Provider } from '@xerena/react'
import '@xerena/react/styles/base.css'
import '@xerena/tokens/tokens.css'

const preview: Preview = {
  decorators: [
    (Story) => (
      <Provider>
        <Story />
      </Provider>
    ),
  ],
}

export default preview
