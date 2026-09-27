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
            { name: '@xerena/native', message: 'preview package must not import native' },
            { name: 'react-native', message: 'native code is not allowed here' },
            { name: 'tailwindcss', message: 'preview package is Tailwind-free; use token CSS variables' },
          ],
        },
      ],
    },
  },
]
