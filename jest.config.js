module.exports = {
  testEnvironment: 'jsdom',
  verbose: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['*.js'],
  testMatch: ['**/*.test.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};
