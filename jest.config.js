module.exports = {
    testEnvironment: 'jsdom',
    testMatch: ['**/__tests__/**/*.test.js'],
    collectCoverageFrom: [
        'js/**/*.js',
        '!js/**/*.test.js',
        '!node_modules/**'
    ],
    coverageDirectory: 'coverage',
    verbose: true,
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
