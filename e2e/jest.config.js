module.exports = {
  testTimeout: 120000,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  reporters: ['detox/runners/jest/streamlineReporter'],
};
