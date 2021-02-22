/* eslint-disable */
const {
    concurrent,
    series,
    nps,
    run,
    rollup,
    typedoc,
    jest,
    prettier,
    eslint,
    serve,
    remove,
    copy
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
        default: 'nps help',

        dev: {
            script: series(
                nps('clean.parser'),
                nps('generate.parser'),
                run({ file: './src/index.ts' })
            ),
            description: 'Run "index.ts" in development mode',
            watch: {
                script: series(
                    nps('clean.parser'),
                    nps('generate.parser'),
                    run({ file: './src/index.ts', watch: './src/**/*.ts' })
                ),
                description: 'Run "index.ts" in development mode and watch for changes'
            }
        },

        build: {
            script: series(
                nps('clean.dist'),
                nps('clean.parser'),
                nps('generate.parser'),
                rollup()
            ),
            description: 'Build the application into "dist" folder',
            watch: {
                script: series(
                    nps('clean.dist'),
                    nps('clean.parser'),
                    nps('generate.parser'),
                    rollup({ watch: './src/**/*' })
                ),
                description: 'Build the application into "dist" folder and watch for changes'
            }
        },

        test: {
            script: series(nps('clean.coverage'), nps('lint'), jest({ coverage: true })),
            description: 'Run the tests, including linting',
            watch: {
                script: series(jest({ coverage: true, watch: true })),
                description: 'Run the tests with no linting, and wait for changes'
            },
            serve: {
                script: series(
                    nps('clean.coverage'),
                    jest({ coverage: true, noThreshold: true }),
                    serve('./coverage')
                ),
                description:
                    'Run the tests, including linting, and serve the coverage reports in HTML',
                watch: {
                    script: series(
                        nps('clean.coverage'),
                        concurrent(
                            jest({ coverage: true, noThreshold: true, watch: true }),
                            serve('./coverage')
                        )
                    ),
                    description:
                        'Run the tests with no linting, and wait for changes, and serve the coverage report'
                }
            }
        },

        doc: {
            script: series(
                nps('clean.docs'),
                typedoc(),
                copy({ src: './docs/index.html', dest: './docs/globals.html' })
            ),
            description: 'Run Typedoc and generate docs',
            watch: {
                script: series(nps('doc'), typedoc({ watch: true })),
                description: 'Run Typedoc and generate docs and watch for changes.'
            },
            serve: {
                script: series(nps('doc'), serve('./docs')),
                description: 'Run Typedoc and generate docs, then serve the docs as HTML',
                watch: {
                    script: series(
                        nps('doc'),
                        concurrent(typedoc({ watch: true }), serve('./docs'))
                    ),
                    description:
                        'Run Typedoc and generate docs and watch for changes while serving the docs as HTML'
                }
            }
        },

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

        clean: {
            script: series(
                nps('clean.parser'),
                nps('clean.dist'),
                nps('clean.docs'),
                nps('clean.coverage')
            ),
            description: 'Remove all automatically generated files and folders',
            parser: {
                script: remove({ files: './src/grammar/gbb-grammar.js' }),
                description: 'Delete the generated parser',
                silent: true
            },
            dist: {
                script: remove({ files: './dist' }),
                description: 'Delete the dist folder',
                silent: true
            },
            docs: {
                script: remove({ files: './docs' }),
                description: 'Delete the docs folder',
                silent: true
            },
            coverage: {
                script: remove({ files: './coverage' }),
                description: 'Delete the coverage folder',
                silent: true
            }
        },

        lint: {
            script: series(eslint({ files: './src' }), eslint({ files: './test' })),
            description: 'Run ESLint on all the files (src and tests)',
            fix: {
                script: series(
                    eslint({ files: './src', fix: true }),
                    eslint({ files: './test', fix: true })
                ),
                description: 'Run ESLint on all the files (src and tests) with --fix option'
            }
        },

        prettify: {
            script: prettier({ files: './src/**/*.ts' }),
            description: 'Run Prettier on all the files, writing the results'
        }
    }
};
