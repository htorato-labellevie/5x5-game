module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './backend',
  testMatch: ['**/test/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  }
};
