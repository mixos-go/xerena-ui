import './fonts.css'
import type { Preview } from '@storybook/react'
import { Provider } from '@xerena/react'
import '@xerena/react/styles/base.css'
import '@xerena/tokens/tokens.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'sand',
      values: [
        { name: 'sand', value: '#faf7f2' },
        { name: 'dark', value: '#1b1712' },
      ],
    },
  },
  globalTypes: {
    darkMode: {
      description: 'Dark mode',
      toolbar: {
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    darkMode: 'light',
  },
  decorators: [
    (Story, { globals }) => (
      <Provider theme={{ mode: globals.darkMode === 'dark' ? 'dark' : 'light' }}>
        <Story />
      </Provider>
    ),
  ],
}

export default preview