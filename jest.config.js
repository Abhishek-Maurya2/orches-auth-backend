module.exports = {
  testEnvironment: 'node',
  verbose: true,
  collectCoverageFrom: ['src/**/*.js', '!src/server.js'],
  coverageDirectory: 'coverage',
};
