/* eslint-disable */
/**
 * Windows: Please do not use trailing comma as windows will fail with token error
 */
const {
    concurrent,
    series,
    nps,
    run,
    webpack,
    typedoc,
    jest,
    prettier,
    eslint,
    serve,
    rename,
    remove,
    copy,
    chmod,
    onchange
} = require('./nps-tooling');

const paths = {
    grammarFile: './src/grammar/gbb-grammar.ne',
    grammarOutput: './src/grammar/gbb-grammar.js',
    grammarDocs: './docs/gbb-parser.html'
};

function nearleyCompiler(path, output) {
    return `nearleyc ${path} -o ${output}`;
}

module.exports = {
    scripts: {
        default: nps('dev'),
        /*
         * Run the index in development mode
         */
        dev: {
            script: series(nps('generate.parser'), run('./src/index.ts'), nps('clean.parser')),
            description: 'Run the index in development mode',
            watch: {
                script: onchange('./src/**/*.ts', run('./src/index.ts'))
            }
        },
        /*
         * Build the application for deployment
         */
        build: {
            script: series(
                nps('clean.dist'),
                nps('generate.parser'),
                webpack(),
                rename('dist/gobstones-gbb-parser.js', 'dist/gobstones-gbb-parser'),
                chmod('+x', 'dist/gobstones-gbb-parser'),
                nps('clean.parser')
            ),
            description: 'Build the application into the dist folder'
        },
        /*
         * Run the tests
         */
        test: {
            script: series(nps('clean.coverage'), nps('lint'), nps('generate.parser'), jest()),
            description: 'Run the index in development mode',
            serve: {
                script: series(
                    nps('clean.coverage'),
                    nps('lint'),
                    nps('generate.parser'),
                    jest('--coverageThreshold "{}"'),
                    serve('./coverage')
                ),
                description: 'Serve the coverage report produced by jest'
            }
        },
        /**
         * Nearley
         */
        generate: {
            parser: {
                script: nearleyCompiler(paths.grammarFile, paths.grammarOutput),
                description:
                    'Compile the grammar in a source file. Used only for local running and testing',
                hiddenFromHelp: true,
                silent: true
            },
            parser_doc: {
                script: `nearley-railroad ${paths.grammarFile} -o ${paths.grammarDocs}`,
                description:
                    'Generate an HTML Documentation file with Railroad diagrams for the language',
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
        /**
         * Helpers
         */
        clean: {
            parser: {
                script: remove(paths.grammarOutput),
                description: 'Delete the generated grammar file',
                hiddenFromHelp: true,
                silent: true
            },
            dist: {
                script: remove('./dist'),
                description: 'Delete the dist folder',
                hiddenFromHelp: true,
                silent: true
            },
            docs: {
                script: remove('./docs'),
                description: 'Delete the docs folder',
                hiddenFromHelp: true,
                silent: true
            },
            coverage: {
                script: remove('./coverage'),
                description: 'Delete the coverage folder',
                hiddenFromHelp: true,
                silent: true
            }
        },
        prettify: {
            script: prettier('./src/**/*.ts'),
            description: 'Run Prettier on all the files',
            hiddenFromHelp: true
        },
        lint: {
            script: eslint('./src'),
            description: 'Run ESLint on all the files',
            hiddenFromHelp: true,
            fix: {
                script: series(eslint('./src', true), eslint('./test', true)),
                description: 'Run ESLint on all the files with --fix',
                hiddenFromHelp: true
            }
        },
        doc: {
            script: series(
                nps('clean.docs'),
                nps('generate.parser'),
                typedoc(),
                copy('./docs/index.html', './docs/globals.html')
            ),
            description: 'Run Typedoc and generate docs',
            hiddenFromHelp: true,
            serve: {
                script: series('nps doc', serve('./docs')),
                description: 'Generate and serve the docs as static files',
                hiddenFromHelp: true
            },
            watch: {
                script: series(
                    nps('clean.docs'),
                    concurrent(serve('./docs'), onchange('./src/**/*.ts', nps('doc')))
                )
            }
        }
    }
};
