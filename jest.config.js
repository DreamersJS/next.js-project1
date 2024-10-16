import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './', // Path to your Next.js app
});

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Match the path alias from your jsconfig.json
    '\\.(css|less|scss)$': 'identity-obj-proxy', // Mock CSS/SCSS imports
    '\\.(png|jpg|jpeg|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js', // Mock static files
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

export default createJestConfig(customJestConfig);
