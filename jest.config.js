/** @type {import('jest').Config} */
const config = {
  // The test environment that will be used for testing. 'jsdom' is for browser-like environments.
  testEnvironment: 'jsdom',

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // A list of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['src/js/**/*.js'],
};

module.exports = config;
