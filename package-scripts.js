/**
 * Windows: Please do not use trailing comma as windows will fail with token error
 */

const { series, rimraf } = require('nps-utils');

const paths = {
    grammarFile: './src/grammar/gbb-grammar.ne',
    grammarOutput: './src/grammar/gbb-grammar.js',
    grammarDocs: './docs/gbb-parser.html',
}

module.exports = {
    scripts: {
        default: 'nps start',
        /*
         * Run the index in development mode
         */
        start: {
            script: series(
                'nps generate.parser',
                run('./src/index.ts'),
                'nps clean.parser'
            ),
            description: 'Run the index in development mode'
        },
        run: {
            script: run('./src/index.ts'),
            description: 'Run the index in development mode without generating the parser',
            hiddenFromHelp: true
        },
        /*
         * Build the application for deployment
         */
        build: {
            script: series(
                'nps generate.parser',
                'webpack',
                'nps clean.parser'
            ),
            description: 'Build the application into the dist folder'
        },
        /*
         * Run the tests
         */
        test: {
            script: jest(),
            description: 'Run the index in development mode',
            parse: {
                script: jest('Parse with valid grammars'),
                description: 'Run the index in development mode'
            },
        },
        /**
         * Nearly generation scripts.
         */
        generate: {
            parser: {
                script: nearlyCompiler(paths.grammarFile, paths.grammarOutput),
                description: 'Compile the grammar in a source file. Used only for local running and testing',
                hiddenFromHelp: true,
                silent: true
            },
            parser_doc: {
                script: `nearley-railroad ${paths.grammarFile} -o ${paths.grammarDocs}`,
                description: 'Generate an HTML Documentation file with Railroad diagrams for the language',
                hiddenFromHelp: true,
                silent: true
            },
            test_board: {
                script: `nearley-unparse ${paths.grammarFile} -n 1`,
                description: 'Generate a board that complies with the grammar',
                hiddenFromHelp: true,
                silent: true
            }
        },
        clean: {
            parser: {
                script: rimraf(paths.grammarOutput),
                description: 'Delete the generated grammar file',
                hiddenFromHelp: true,
                silent: true
            },
            dist: {
                script: rimraf('./dist'),
                description: 'Delete the dist folder',
                hiddenFromHelp: true,
                silent: true
            }
        },
        /**
         * Prettifying and Linting helpers
         */
        prettify: {
            script: prettier('./src/**/*.ts'),
            description: 'Run Prettier on all the files',
            hiddenFromHelp: true
        },
        lint: {
            script: eslint('./src'),
            description: 'Run ESLint on all the files',
            hiddenFromHelp: true
        }
    }
};

function jest(tests) {
    return series(
        'nps lint',
        'nps generate.parser',
        tests ? ('jest -t "' + tests + '"') : 'jest',
        'nps clean.parser'
    )
}

function run(path) {
    return `ts-node ${path}`;
}

function nearlyCompiler(path, output) {
    return `nearleyc ${path} -o ${output}`;
}

function eslint(path) {
    return `eslint ${path} --format stylish --ext ts --color`;
}

function prettier(path) {
    return `prettier --write ${path}`;
}
