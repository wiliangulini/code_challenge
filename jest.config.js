/** @type {import('jest').Config} */

module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx'
      }
    }]
  },
  testMatch: ['**/__tests__/**/*.(spec|test).[jt]s?(x)', '**/test/**/*.(spec|test).[jt]s?(x)']
}

