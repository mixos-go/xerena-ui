import React from 'react'
import type { Preview } from '@storybook/react'
import { Provider } from '@xerena/react'
import '@xerena/react/styles/base.css'

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