import base from '@xerena/eslint-config'

export default [
  ...base,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: '@xerena/native', message: 'web package must not import native' },
            { name: 'react-native', message: 'native code is not allowed here' },
            { name: '@xerena/react', message: 'brand package must not depend on @xerena/react' },
          ],
        },
      ],
    },
  },
]