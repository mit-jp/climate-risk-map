export default {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
        '\\.(gif|ttf|eot|svg|png|jpg)$': '<rootDir>/mocks/fileMock.ts',
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '^uuid$': '<rootDir>/node_modules/uuid/dist/index.js',
    },
    setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
}
