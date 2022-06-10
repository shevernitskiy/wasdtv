module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testRegex: '(/test/.*|(\\.|/)(test|spec))\\.ts$',
  coverageDirectory: 'coverage',
  coverageReporters: ['json-summary'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
}
