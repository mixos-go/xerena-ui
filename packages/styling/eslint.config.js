import base from '@xerena/eslint-config'

export default [
  ...base,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: 'styling root surface must not depend on React — use @xerena/styling/react' },
            { name: 'react-dom', message: 'styling root surface must not depend on React DOM' },
            { name: '@xerena/react', message: 'styling must not depend on @xerena/react' },
            { name: '@xerena/react-native', message: 'styling must not depend on @xerena/react-native' },
          ],
        },
      ],
    },
  },
  {
    files: ['src/react/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: '@xerena/react-native', message: 'styling must not depend on @xerena/react-native' },
          ],
        },
      ],
    },
  },
]
