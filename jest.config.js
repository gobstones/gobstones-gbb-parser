module.exports = {
    preset: 'ts-jest',
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.json',
            importHelpers: true
        }
    },
    coverageReporters: ['text', 'html'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: -10
        }
    },
    collectCoverageFrom: ['src/**/*', '!src/cli.ts', '!src/grammar/gbb-grammar.js']
};
