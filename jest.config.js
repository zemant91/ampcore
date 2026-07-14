/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@calc/engine$': '<rootDir>/packages/engine/src/index.ts',
    '^@calc/data$': '<rootDir>/packages/data/src/index.ts',
    '^@calc/calculators-electrical$':
      '<rootDir>/packages/calculators/electrical/src/index.ts',
    '^@calc/ui$': '<rootDir>/packages/ui/src/index.ts',
    // Runtime-only react-native substitute for ts-jest — see packages/ui/__mocks__/react-native.ts
    '^react-native$': '<rootDir>/packages/ui/__mocks__/react-native.ts',
  },
};
