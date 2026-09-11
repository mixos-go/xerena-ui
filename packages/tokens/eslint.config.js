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
            { name: '@xerena/react', message: 'tokens must be zero-dependency' },
            { name: '@xerena/native', message: 'tokens must be zero-dependency' },
          ],
        },
      ],
    },
  },
]
