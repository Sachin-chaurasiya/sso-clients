// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '__tests__/.*\\.test\\.ts$',
  collectCoverage: true,
  coverageReporters: ['json', 'text-summary'],
};
