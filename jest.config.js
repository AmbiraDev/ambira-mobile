/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.(test|spec).[jt]s?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/tests/setup/jest-setup.ts',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|expo(nent)?|@expo|expo-auth-session|@unimodules|unimodules|@react-native-async-storage)/)',
  ],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/types/**'],
};
