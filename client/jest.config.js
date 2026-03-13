export default {
  // The test environment that will be used for testing
  testEnvironment: 'jest-environment-jsdom',

  // A map from regular expressions to module names that allow to stub out resources with a single module
  moduleNameMapper: {
    // Handle CSS imports (and other style files)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // The setup files to run before each test file
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};