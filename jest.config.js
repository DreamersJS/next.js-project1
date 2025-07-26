import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './', // Path to your Next.js app
});

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',// Simulates browser env
  moduleNameMapper: {
    '^canvas$': '<rootDir>/__mocks__/canvas.js',  // <-- force mock canvas
    '^node-canvas$': '<rootDir>/__mocks__/canvas.js', // alias, just in case
    "^firebase$": "<rootDir>/__mocks__/firebase.js", // Mock Firebase Realtime Database

    '^@/(.*)$': '<rootDir>/src/$1', // Path alias, matches jsconfig.json
    '\\.(css|less|scss)$': 'identity-obj-proxy', // Mock CSS imports
    '\\.(png|jpg|jpeg|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js', // Mock static files
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

export default createJestConfig(customJestConfig);
