// Read directly (not just via `preset:` below) so we can extend its
// `transform` map — the preset's own map has no `.mjs` entry, and
// lucide-react-native ships ESM (.mjs) that still needs babel-jest.
const reactNativePreset = require('@react-native/jest-preset');

module.exports = {
  preset: '@react-native/jest-preset',
  // The default preset only transpiles react-native/@react-native(-community) —
  // @react-navigation, react-native-* (screens/safe-area-context/mmkv) and
  // lucide-react-native are also published as ESM source and fail on
  // `export`/`import` in jest without this.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-.*|lucide-react-native)/)',
  ],
  transform: {
    ...reactNativePreset.transform,
    '^.+\\.mjs$': 'babel-jest',
  },
  // Jest never runs Metro, so react-native-svg-transformer doesn't apply here —
  // .svg imports (see src/icons/index.tsx) need their own mock.
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
  },
};
