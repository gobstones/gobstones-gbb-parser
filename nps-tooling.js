/* eslint-disable */
const npsUtils = require('nps-utils');
const path = require('path');

const stripIndent = npsUtils.stripIndent;
const rimraf = npsUtils.rimraf;
const ifNotWindows = npsUtils.ifNotWindows;
const ncp = npsUtils.copy;
const concurrently = npsUtils.concurrent;
const serially = npsUtils.series;

/**
 * Call another nps action.
 * @example `nps('clean.dist')`
 * @example `nps('build')`
 */
function nps(action) {
    if (!action) {
        throw new Error('"nps" expect a defined nps action as argument');
    }
    return `nps ${action}`;
}

/**
 * Run a specific file with ts-node.
 * @param options "run" requires options with the following signature:
 * ```
    {
        file: string   // The main file to run
        watch?: boolean  // Watch a set of files for changes
    }
   ```
 * @example `run({file: './src/index.ts', watch: false })`
 */
function run(options) {
    options = options || {};
    if (!options.file) {
        throw Error(stripIndent`"run" requires options with the following signature:
                {
                    file: string   // The main file to run
                    watch?: string  // Watch a set of files for changes
                }`);
    }
    return (
        `ts-node-dev ${options.file}` +
        (options.watch ? ` --watch ${options.watch}` : ' --ignore-watch')
    );
}

/**
 * Run webpack with default configuration
 * @param options "webpack" expects no options. All options are expected to be configured in "webpack.config.js"
 * @example `webpack()`
 */
function webpack(options) {
    if (options) {
        throw new Error(
            '"webpack" expects no options. All options are expected to be configured in "webpack.config.js"'
        );
    }
    return `webpack`;
}

/**
 * Run rollup with default configuration
 * @param options "rollup" takes configuration from "rollup.config.js" but
 *  the additional options may be given:
 *  ```
    {
        watch?: string  // Watch the given files for changes
    }
   ```
 * @example `rollup()`
 */
function rollup(options) {
    options = options || {};
    return `rollup -c` + (options.watch ? ` --watch ${options.watch}` : '');
}

/**
 * Run tests with jest, including coverage. If any test contains an ".only" call, only run that
 * specific file (Only working in UNIXes).
 * You may add additional arguments to jest.
 * @param options "jest" takes configuration from "jest.config.js" but the following can be given
 * ```
    {
        coverage?: boolean  // Use coverage
        noThreshold?: boolean // Disable default threshold for coverage
        watch?: boolean  // Run in watch mode
    }
   ```
 * @example `jest({ coverage: true })`
 */
function jest(options) {
    options = options || {};
    const additionalArgs =
        (options.coverage ? ' --coverage ' : '') +
        (options.noThreshold ? ' --coverageThreshold "{}" ' : '') +
        (options.watch ? ' --watch' : '');
    // Only for POSIX Based OSes, if a test file (withing test folder and ending in .test.ts)
    // contains the .only key, run exclusively that file, else, run all files as default behavior.
    // This fixes the ugly behavior of jest running all tests always, even on .only.
    // This does not work in Windows, which defaults to running all tests.
    return ifNotWindows(
        'if grep -l "\\.only" ./test/**/*.test.ts; ' +
            'then grep -l "\\.only" ./test/**/*.test.ts | xargs jest; ' +
            'else jest' +
            additionalArgs +
            '; ' +
            'fi',
        'jest --coverage' + additionalArgs
    );
}
/**
 * Run typedoc with  default configuration
 * @param options "typedoc" requires options with the following signature:
 * ```
    {
        watch?: boolean  // Watch a set of files for changes
    }
   ```
 * @example `typedoc()`
 */
function typedoc(options) {
    options = options || {};
    return `typedoc` + (options.watch ? ` --watch ${options.watch}` : '');
}

/**
 * Run eslint in a set of files. You might pass `true` as a second argument
 * in order to fix default problems.
 * @param options "eslint" requires options with the following signature:
 * ```
    {
        files: string   // The files to lint, may be a glob pattern
        fix?: boolean  //Wether to fix the encountered error when possible
    }
   ```
 * @example `eslint({files: './src/** /*' })`
 * @example `eslint({ files: './src/** /*', fix: true })`
 */
function eslint(options) {
    options = options || {};
    if (!options.files) {
        throw Error(stripIndent`"eslint" requires options with the following signature:
                {
                    files: string   // The files to lint, may be a glob pattern
                    fix?: boolean  //Wether to fix the encountered error when possible
                }`);
    }
    return (
        `eslint ${options.files} --format stylish --ext ts --color` + (options.fix ? ' --fix' : '')
    );
}

/**
 * Run prettier in the given files, writing the corrections to the files.
 * @param options "prettier" requires options with the following signature:
 * ```
    {
        files: string   // The files to run prettier on, may be a glob pattern
    }
   ```
 * @example `prettier({ files: './src/** /*' })`
 */
function prettier(options) {
    options = options || {};
    if (!options.files) {
        throw Error(stripIndent`"prettier" requires options with the following signature:
                {
                    files: string   // The files to run prettier on, may be a glob pattern
                }`);
    }
    return `prettier --write ${options.files}`;
}

/**
 * Serve a specific folder as a static server.
 * @example `serve('./coverage')`
 */
function serve(files) {
    if (!files) {
        throw new Error('"serve" expect a directory name as argument');
    }
    return `serve ${files}`;
}

/**
 * Rename a file.
 * @param options "rename" requires options with the following signature:
 * ```
    {
        src: string   // The file or folder to run rename on
        dest: string  // The file or folder used as new name.
    }
   ```
 * @example `rename({ src: './src', dest: './dist' })`
 */
function rename(options) {
    options = options || {};
    if (!options.src || !options.dest) {
        throw Error(stripIndent`"rename" requires options with the following signature:
                {
                    src: string   // The file or folder to run rename on
                    dest: string  // The file or folder used as new name.
                }`);
    }
    return series(copy({ src, dest }), remove({ files: src }));
}

/**
 * Remove (or delete) a set of files
 * @param options "remove" requires options with the following signature:
 * ```
    {
        files: string   // The files or folder to delete, may be a glob pattern
    }
   ```
 * @example `remove({ files: './dist' })`
 */
function remove(options) {
    options = options || {};
    if (!options.files) {
        throw Error(stripIndent`"remove" requires options with the following signature:
                {
                    files: string   // The files or folder to delete, may be a glob pattern
                }`);
    }
    return rimraf(options.files);
}

/**
 * Copy a file or directory
 * ```
    {
        src: string   // The file or folder to copy on
        dest: string  // The file or folder to copy to
        isDist: boolean // Whether the copies element is a dist
                        // that should be copied recursively, defaults to false.
    }
   ```
 * @example `copy({src :'./dist/index.js', dist: './dist/index.es.js'})`
 */
function copy(options) {
    options = options || {};
    if (!options.src || !options.dest) {
        throw Error(stripIndent`"rename" requires options with the following signature:
                {
                    src: string   // The file or folder to copy on
                    dest: string  // The file or folder to copy to
                    isDist: boolean // Whether the copies element is a dist
                                    // that should be copied recursively, defaults to false.
                }`);
    }
    if (options.isDir) {
        return `copyfiles --up 1 ${options.src} ${options.dest}`;
    } else {
        const destFolder = path.dirname(options.dest);
        const destFile = path.basename(options.dest);
        return ncp(`${options.src} ${destFolder} --rename ${destFile}`);
    }
}

/**
 * Perform a chmod on a file or directory, setting specific permissions on it.
 * @param options `"chmod" requires options with the following signature:
 * ```
    {
        files: string   // The files or folder to apply permissions to, may be a glob pattern
        mod: string     // The permissions to apply
    }
   ```
 * @example `chmod({ mod: '+x', file: './dist/files'})`
 */
function chmod(args, file) {
    options = options || {};
    if (!options.files || !options.mod) {
        throw Error(stripIndent`"chmod" requires options with the following signature:
            {
                files: string   // The files or folder to apply permissions to, may be a glob pattern
                mod: string     // The permissions to apply
            }`);
    }
    return `chmod ${options.mod} ${options.files}`;
}

/**
 * Run a set of actions concurrently.
 * Pass an object if you want to associate names to each process.
 *
 * @example `concurrent(nps('build), serve('./dist'))`
 * @example
 * ```
 * concurrent({
 *     build: nps('build),
 *     serve: serve('./dist')
 * })
 * ```
 */
function concurrent() {
    if (arguments.length === 1 && typeof arguments[0] === 'object') {
        return concurrently(arguments[0]);
    } else {
        return concurrently(arguments);
    }
}

/**
 * Run a set of actions serially.
 * @example `serial(nps('build), serve('./dist'))`
 */
const series = serially;

module.exports = {
    nps,
    run,
    webpack,
    rollup,
    jest,
    typedoc,
    eslint,
    prettier,
    serve,
    rename,
    remove,
    copy,
    chmod,
    series,
    concurrent
};
