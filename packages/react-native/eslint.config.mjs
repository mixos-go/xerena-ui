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
            { name: '@xerena/react', message: 'native package must not import web' },
            { name: '@xerena/styling', message: 'native package must not import web styling' },
            { name: 'react-dom', message: 'native package must not import react-dom' },
          ],
        },
      ],
    },
  },
]
