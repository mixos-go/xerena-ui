const reactNativePreset = require('react-native/jest-preset')

/** @type {import('jest').Config} */
module.exports = {
  ...reactNativePreset,
  testMatch: ['**/*.test.{ts,tsx}'],
  transformIgnorePatterns: [
    'node_modules/(?!\\.pnpm/.*/node_modules/(react-native|@react-native|@react-navigation)/|(react-native|@react-native|@react-navigation)/)',
  ],
}